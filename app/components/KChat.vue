<script lang="ts" setup>
import { Send, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ChatMessage } from "@/utils/kchat";

const APP_NAME = "sparql_agent";

const { public: { kchatUrl } } = useRuntimeConfig();
const { pendingQuestion, conversationActive } = useKChatBar();
const { exploring } = useGraphExplore();
const { scrollFade } = useScrollFade();
const { chatFullscreen } = useKChatVariant();
const route = useRoute();

// The chat bar only exists on the landing page.
const isLanding = computed(() => route.path === "/");

// The chat column overlays the page content, so it fades out with the hero as
// soon as the user scrolls toward the main content, returns at the top, and is
// always hidden while the graph is being explored.
const isMobile = ref(false);
const chatHiddenByScroll = computed(() => isLanding.value && (exploring.value || scrollFade.value <= 0));

// Fullscreen variant: the chat fills the viewport under the header, centred in
// a reading-width column, with KHero's scroll-down chip in the gap below it.
// Corner variant: the original top-left column over the graph.
const containerClass = computed(() => chatFullscreen.value
    ? "fixed inset-x-0 top-[4.5rem] bottom-16 z-40 mx-auto flex max-w-2xl flex-col overflow-y-auto px-5 transition-opacity duration-150"
    : "fixed top-24 left-5 right-5 z-40 max-h-[calc(100svh-7rem)] max-w-[420px] overflow-x-hidden overflow-y-auto overscroll-contain transition-opacity duration-150");
const introClass = computed(() => chatFullscreen.value
    ? "pt-8 text-center sm:pt-12"
    : "max-sm:rounded-lg max-sm:bg-background/60 max-sm:p-3 max-sm:backdrop-blur-md");
const messagesClass = computed(() => chatFullscreen.value
    ? "mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
    : "mt-3 max-h-[55vh] overflow-y-auto overscroll-contain pr-1");
const suggestionsClass = computed(() => chatFullscreen.value
    ? "mt-2 flex flex-wrap justify-center gap-1.5"
    : "mt-2 flex flex-wrap gap-1.5");

// The landing hero (KHero) fetches the RDF under this key; share it for the
// company summary shown above the chat bar. Off the landing page the fetch is
// not needed, so it is never started there.
const { data: turtleData } = await useAsyncData(
    "rdf",
    () => $fetch<string>("/?_mediatype=text/turtle"),
    { default: () => "", ...(isLanding.value ? {} : { immediate: false, server: false }) },
);
const summary = computed(() => (isLanding.value ? turtleToSummary(turtleData.value) : null));

const open = ref(false);
const messages = ref<ChatMessage[]>([]);
const input = ref("");
const busy = ref(false);
const suggestions = ref<string[]>([]);
// The initial suggestions hide permanently once a question is asked.
const initialSuggestionsVisible = ref(true);

let userId = "";
let sessionId = "";
const messagesEl = ref<HTMLElement | null>(null);

const artifactOpen = ref(false);
const artifactTitle = ref("");
const artifactMeta = ref("");
const artifactContent = ref("");
let artifactBlob: Blob | null = null;

onMounted(() => {
    userId = localStorage.getItem("kchat.user") || `web-${crypto.randomUUID()}`;
    sessionId = localStorage.getItem("kchat.session") || `chat-${crypto.randomUUID()}`;
    localStorage.setItem("kchat.user", userId);
    localStorage.setItem("kchat.session", sessionId);
    // Random picks are made client-side so server and client markup match.
    suggestions.value = kchatRandomSuggestions(kchatSuggestionCount());
    const media = window.matchMedia("(max-width: 639px)");
    isMobile.value = media.matches;
    media.addEventListener("change", event => {
        isMobile.value = event.matches;
        suggestions.value = kchatRandomSuggestions(kchatSuggestionCount());
    });
});

watch(open, value => {
    if (value) {
        nextTick(() => document.getElementById("kchat-input")?.focus());
    }
});

watch(pendingQuestion, value => {
    if (!value || !kchatUrl) return;
    sendQuestion(value);
    pendingQuestion.value = null;
});

watch([open, messages, isLanding], () => {
    conversationActive.value = isLanding.value && open.value && messages.value.length > 0;
}, { deep: true });

/** Clear the conversation and start a fresh session with new suggestions. */
function clearSession() {
    messages.value = [];
    sessionId = `chat-${crypto.randomUUID()}`;
    localStorage.setItem("kchat.session", sessionId);
    suggestions.value = kchatRandomSuggestions(kchatSuggestionCount());
    initialSuggestionsVisible.value = true;
    open.value = false;
    busy.value = false;
}

function sendQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    initialSuggestionsVisible.value = false;
    if (kchatIsContactQuestion(trimmed)) {
        // Pre-canned response; no agent request is made.
        input.value = "";
        open.value = true;
        messages.value.push({ role: "user", text: KCHAT_CONTACT_QUESTION, artifacts: [] });
        messages.value.push({ role: "assistant", kind: "contact", text: "", artifacts: [] });
        return;
    }
    if (busy.value) return;
    open.value = true;
    input.value = "";
    submit(trimmed);
}

function sessionBase(): string {
    return `${kchatUrl}/apps/${APP_NAME}/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(sessionId)}`;
}

async function ensureSession() {
    const path = sessionBase();
    const existing = await fetch(path);
    if (existing.ok) return;
    const created = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    if (!created.ok && created.status !== 409) throw new Error(`Could not create chat session (${created.status})`);
}

async function listArtifacts(): Promise<{ name: string; version: number }[]> {
    const response = await fetch(`${sessionBase()}/artifacts`);
    if (!response.ok) return [];
    const names: string[] = await response.json();
    const found: { name: string; version: number }[] = [];
    for (const name of names) {
        const versionsResponse = await fetch(`${sessionBase()}/artifacts/${encodeURIComponent(name)}/versions`);
        if (!versionsResponse.ok) continue;
        const versions: number[] = await versionsResponse.json();
        for (const version of versions) found.push({ name, version: Number(version) });
    }
    return found.sort((a, b) => a.version - b.version || a.name.localeCompare(b.name));
}

async function attachArtifacts(message: ChatMessage, known: Set<string>) {
    for (const artifact of await listArtifacts()) {
        const key = `${artifact.name}:${artifact.version}`;
        if (known.has(key)) continue;
        message.artifacts.push({ ...artifact, label: kchatArtifactLabel(artifact.name) });
    }
}

async function openArtifact(name: string, version: number) {
    artifactTitle.value = name;
    artifactMeta.value = `version ${version}`;
    artifactContent.value = "Loading artifact…";
    artifactOpen.value = true;
    try {
        const response = await fetch(`${sessionBase()}/artifacts/${encodeURIComponent(name)}/versions/${version}`);
        if (!response.ok) throw new Error(`Could not load artifact (${response.status})`);
        const part = await response.json();
        const inline = part?.inlineData ?? part?.inline_data;
        let value = part?.text ?? "";
        let mime = "text/plain";
        if (inline?.data) {
            mime = inline.mimeType ?? inline.mime_type ?? mime;
            value = kchatDecodeArtifact(inline.data);
        }
        artifactBlob = new Blob([value], { type: mime });
        let display = value;
        if (name.toLowerCase().endsWith(".json") || mime.toLowerCase().includes("json")) {
            try {
                display = JSON.stringify(JSON.parse(value), null, 2);
            } catch {
                // Not valid JSON: show the original content.
            }
        }
        artifactMeta.value = `version ${version} · ${value.length.toLocaleString()} chars`;
        artifactContent.value = display;
    } catch (error) {
        artifactContent.value = error instanceof Error ? error.message : String(error);
    }
}

function downloadArtifact() {
    if (!artifactBlob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(artifactBlob);
    link.download = artifactTitle.value;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function scrollToEnd() {
    nextTick(() => {
        if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    });
}

async function submit(message: string) {
    messages.value.push({ role: "user", text: message, artifacts: [] });
    const assistant = reactive<ChatMessage>({ role: "assistant", text: "", artifacts: [], typing: true });
    messages.value.push(assistant);
    busy.value = true;
    scrollToEnd();
    let answer = "";
    try {
        await ensureSession();
        // Snapshot the session's artifacts before asking so only the ones
        // this answer generates are attached to it, never older ones.
        const known = new Set((await listArtifacts()).map(artifact => `${artifact.name}:${artifact.version}`));
        const response = await fetch(`${kchatUrl}/run_sse`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                appName: APP_NAME,
                userId,
                sessionId,
                streaming: true,
                newMessage: { role: "user", parts: [{ text: message }] },
            }),
        });
        await kchatConsumeSse(response, event => {
            const chunk = kchatEventText(event);
            if (chunk) {
                if (event.partial === false && answer && chunk.startsWith(answer)) answer = chunk;
                else answer += chunk;
                assistant.text = answer;
                scrollToEnd();
            }
        });
        if (!answer) answer = "No text response was returned.";
        assistant.text = answer;
        await attachArtifacts(assistant, known);
    } catch (error) {
        assistant.error = true;
        assistant.text = `**Chat error:** ${error instanceof Error ? error.message : String(error)}`;
    } finally {
        assistant.typing = false;
        busy.value = false;
        scrollToEnd();
    }
}

function onFormSubmit() {
    sendQuestion(input.value);
}
</script>

<template>
    <div v-if="kchatUrl" class="font-sans">
        <!-- Landing page: title, blurb and chat. Fullscreen variant: the chat
             fills the viewport under the header. Corner variant: a top-left
             column over the graph. Hidden while the graph is being explored. -->
        <div
            v-if="isLanding"
            v-show="!chatHiddenByScroll"
            :style="{ opacity: scrollFade }"
            :class="containerClass"
        >
            <!-- Fullscreen: centred intro with breathing room under the header.
                 Corner: on small screens the graph backdrop is busy, so the
                 intro gets a faint background to keep it legible. -->
            <div :class="introClass">
                <h1 class="text-4xl font-bold text-foreground !m-0 sm:text-5xl">Graphs, Models, AI?</h1>
                <p class="text-lg text-muted-foreground !m-0">Hello KurrawongAI!</p>
                <p v-if="summary" class="mt-1 text-sm leading-relaxed text-foreground/80 !my-0" :class="chatFullscreen ? 'mx-auto max-w-xl' : ''">{{ summary.description }}</p>
            </div>

            <!-- Initial layout: chat bar with suggested questions below it.
                 The bar hides while an answer is being generated. -->
            <template v-if="initialSuggestionsVisible">
                <form
                    v-show="!busy"
                    class="bg-card/70 dark:bg-white mt-4 flex items-center gap-2 rounded-md border border-border/70 py-1 pr-1.5 pl-4 shadow-sm backdrop-blur-md dark:border-black/10"
                    @submit.prevent="onFormSubmit"
                >
                    <input
                        id="kchat-input"
                        v-model="input"
                        type="text"
                        autocomplete="off"
                        placeholder="Ask about KurrawongAI…"
                        aria-label="Ask a question about KurrawongAI"
                        class="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/80 dark:text-neutral-900 dark:placeholder:text-neutral-500"
                    >
                    <Button type="submit" size="icon" class="size-8 shrink-0 rounded-md dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-900/90" aria-label="Send question" :disabled="busy || !input.trim()">
                        <Send class="size-4" />
                    </Button>
                </form>

                <div :class="suggestionsClass">
                    <button
                        v-for="suggestion in suggestions"
                        :key="suggestion"
                        type="button"
                        class="bg-card/80 hover:bg-accent dark:bg-white/90 dark:border-black/10 dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-full border px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm"
                        :disabled="busy"
                        @click="sendQuestion(suggestion)"
                    >
                        {{ suggestion }}
                    </button>
                </div>
            </template>

            <Transition name="kchat-conversation">
                <div v-if="open" ref="messagesEl" :class="messagesClass">
                    <KChatMessages :messages="messages" @open-artifact="openArtifact" @send="sendQuestion" />
                </div>
            </Transition>

            <!-- Conversation layout: messages above, bar at the bottom with a
                 button to clear the session and start anew. The bar hides
                 while an answer is being generated. -->
            <form
                v-if="!initialSuggestionsVisible"
                v-show="!busy"
                class="bg-card/70 dark:bg-white sticky bottom-0 mt-3 flex items-center gap-2 rounded-md border border-border/70 py-1 pr-1.5 pl-4 shadow-sm backdrop-blur-md dark:border-black/10"
                @submit.prevent="onFormSubmit"
            >
                <input
                    id="kchat-input"
                    v-model="input"
                    type="text"
                    autocomplete="off"
                    placeholder="Type a follow-up question…"
                    aria-label="Ask a follow-up question"
                    class="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/80 dark:text-neutral-900 dark:placeholder:text-neutral-500"
                >
                <Button variant="ghost" type="button" size="icon" class="text-muted-foreground hover:text-foreground dark:text-neutral-500 dark:hover:text-neutral-900 size-8 shrink-0 rounded-md" aria-label="Clear chat and start a new one" title="Clear chat and start a new one" @click="clearSession">
                    <X class="size-4" />
                </Button>
                <Button type="submit" size="icon" class="size-8 shrink-0 rounded-md dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-900/90" aria-label="Send question" :disabled="busy || !input.trim()">
                    <Send class="size-4" />
                </Button>
            </form>
        </div>

        <Dialog v-model:open="artifactOpen">
            <DialogContent class="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{{ artifactTitle }}</DialogTitle>
                    <DialogDescription>{{ artifactMeta }}</DialogDescription>
                </DialogHeader>
                <pre class="bg-muted max-h-[60vh] overflow-auto rounded-md p-3 text-xs leading-relaxed">{{ artifactContent }}</pre>
                <div class="flex justify-end">
                    <Button variant="outline" size="sm" :disabled="!artifactBlob" @click="downloadArtifact">Download</Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped>
.kchat-conversation-enter-active {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.kchat-conversation-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
