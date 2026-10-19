<script lang="ts" setup>
import { MessageCircle, Send, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ChatMessage } from "@/utils/kchat";

const APP_NAME = "sparql_agent";

const { public: { kchatUrl } } = useRuntimeConfig();
const { pendingQuestion } = useKChatBar();
const { exploring } = useGraphExplore();
const route = useRoute();

// The landing page shows the chat bar in the top-left corner; other pages get
// the floating launcher in the bottom-right.
const isLanding = computed(() => route.path === "/");

// The landing hero (KHero) fetches the RDF under this key; reuse it for the
// company summary shown above the chat bar.
const { data: turtleData } = useNuxtData<string>("rdf");
const summary = computed(() => (isLanding.value ? turtleToSummary(turtleData.value ?? "") : null));

const open = ref(false);
const messages = ref<ChatMessage[]>([]);
const input = ref("");
const busy = ref(false);

let userId = "";
let sessionId = "";
const knownArtifacts = new Set<string>();
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

function sendQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed || busy.value) return;
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

async function attachArtifacts(message: ChatMessage) {
    const found: ChatMessage["artifacts"] = [];
    for (const artifact of await listArtifacts()) {
        const key = `${artifact.name}:${artifact.version}`;
        if (!knownArtifacts.has(key)) {
            knownArtifacts.add(key);
            found.push({ ...artifact, label: kchatArtifactLabel(artifact.name) });
        }
    }
    message.artifacts.push(...found);
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
        await attachArtifacts(assistant);
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
        await attachArtifacts(assistant);
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

function onInputKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onFormSubmit();
    }
}
</script>

<template>
    <div v-if="kchatUrl" class="font-sans">
        <!-- Landing page: title, blurb and chat bar in the top-left corner.
             Hidden while the graph is being explored. -->
        <div v-if="isLanding && !exploring" class="fixed top-24 left-5 z-[80] w-[min(calc(100vw-2.5rem),420px)]">
            <div>
                <h1 class="text-4xl font-bold text-foreground !m-0 sm:text-5xl">Graphs, Models, AI?</h1>
                <p class="text-lg text-muted-foreground !m-0">Hello KurrawongAI!</p>
                <p v-if="summary" class="mt-1 text-sm leading-relaxed text-foreground/80 !my-0">{{ summary.description }}</p>
            </div>

            <form class="bg-card mt-4 flex items-center gap-1 rounded-full border p-1.5 pl-4 shadow-lg" @submit.prevent="onFormSubmit">
                <input
                    id="kchat-input"
                    v-model="input"
                    type="text"
                    placeholder="Ask about KurrawongAI…"
                    aria-label="Ask a question about KurrawongAI"
                    class="h-9 flex-1 bg-transparent text-sm outline-none"
                >
                <Button v-if="open" variant="ghost" size="icon" class="size-9 shrink-0 rounded-full" aria-label="Close chat" @click="open = false">
                    <X />
                </Button>
                <Button type="submit" size="icon" class="size-9 shrink-0 rounded-full" aria-label="Send question" :disabled="busy || !input.trim()">
                    <Send />
                </Button>
            </form>

            <div class="mt-2 flex flex-wrap gap-1.5">
                <button
                    v-for="suggestion in KCHAT_SUGGESTIONS"
                    :key="suggestion"
                    type="button"
                    class="bg-card/80 hover:bg-accent rounded-full border px-2.5 py-1 text-xs shadow-sm backdrop-blur-sm"
                    :disabled="busy"
                    @click="sendQuestion(suggestion)"
                >
                    {{ suggestion }}
                </button>
            </div>

            <Transition name="kchat-conversation">
                <div v-if="open" ref="messagesEl" class="mt-3 max-h-[55vh] overflow-y-auto overscroll-contain pr-1">
                    <KChatMessages :messages="messages" @open-artifact="openArtifact" @send="sendQuestion" />
                </div>
            </Transition>
        </div>

        <!-- Other pages: floating launcher in the bottom-right corner. -->
        <Button
            v-if="!isLanding && !open"
            size="lg"
            class="fixed bottom-5 right-5 z-[80] rounded-full pr-5 shadow-lg"
            aria-label="Open chat"
            @click="open = true"
        >
            <MessageCircle />
            Ask KurrawongAI
        </Button>

        <div
            v-if="!isLanding && open"
            class="bg-card text-card-foreground fixed bottom-5 right-5 z-[80] flex h-[min(70vh,600px)] w-[min(calc(100vw-2.5rem),400px)] flex-col overflow-hidden rounded-lg border shadow-xl"
            role="dialog"
            aria-label="KurrawongAI chat"
        >
            <div class="border-b px-4 py-3">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-semibold">Ask KurrawongAI</h2>
                    <Button variant="ghost" size="icon" aria-label="Close chat" @click="open = false">
                        <X />
                    </Button>
                </div>
            </div>

            <div ref="messagesEl" class="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                <KChatMessages :messages="messages" show-suggestions @open-artifact="openArtifact" @send="sendQuestion" />
            </div>

            <form class="border-t p-3" @submit.prevent="onFormSubmit">
                <div class="flex items-end gap-2">
                    <textarea
                        id="kchat-input"
                        v-model="input"
                        rows="1"
                        placeholder="Type a message…"
                        class="bg-background min-h-9 max-h-25 flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        @keydown="onInputKeydown"
                    />
                    <Button type="submit" size="icon" :disabled="busy || !input.trim()" aria-label="Send message">
                        <Send />
                    </Button>
                </div>
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
