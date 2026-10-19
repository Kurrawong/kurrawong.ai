<script lang="ts" setup>
import { Send, Waypoints, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const { public: { kchatUrl } } = useRuntimeConfig();
const { ask } = useKChatBar();

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const summary = computed(() => turtleToSummary(turtleData.value));

const question = ref("");
const exploring = ref(false);
const selectedNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);

function submitQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed || !kchatUrl) return;
    ask(trimmed);
    question.value = "";
}

watch(exploring, value => {
    document.body.style.overflow = value ? "hidden" : "";
    if (!value) selectedNode.value = null;
});

onBeforeUnmount(() => {
    document.body.style.overflow = "";
});

const summaryLinks = computed(() => summary.value ? [
    { label: `${summary.value.counts.people} people`, to: "/about-us/our-people" },
    { label: `${summary.value.counts.products} products`, to: "/products" },
    { label: `${summary.value.counts.services} services`, to: "/services" },
    { label: `${summary.value.counts.projects} projects`, to: "/about-us/our-projects" },
] : []);
</script>

<template>
    <div class="relative -mx-5 not-prose overflow-hidden rounded-lg min-h-[calc(100svh-4.5rem)] flex">
        <div
            class="absolute inset-0 transition-all duration-500"
            :class="exploring
                ? 'fixed inset-0 z-[60] bg-background blur-0 opacity-100'
                : 'opacity-40 blur-[6px] pointer-events-none dark:opacity-25'"
        >
            <ClientOnly>
                <KGraphCanvas :turtle="turtleData" @select="selectedNode = $event" />
            </ClientOnly>
        </div>

        <div v-show="!exploring" class="relative z-10 m-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center">
            <div class="flex flex-col gap-2">
                <h1 class="text-5xl font-bold text-foreground !m-0 sm:text-6xl">Graphs, Models, AI?</h1>
                <p class="text-xl text-muted-foreground !m-0">Hello KurrawongAI!</p>
            </div>

            <div v-if="summary" class="bg-secondary/50 dark:bg-secondary/30 rounded-lg p-4 text-sm leading-relaxed backdrop-blur-sm">
                <p class="!my-0">{{ summary.description }}</p>
                <div class="mt-3 flex flex-wrap justify-center gap-2">
                    <NuxtLink
                        v-for="link in summaryLinks"
                        :key="link.to"
                        :to="link.to"
                        class="bg-background hover:bg-accent rounded-full border px-3 py-1 text-xs no-underline"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </div>
            </div>

            <form v-if="kchatUrl" class="flex w-full max-w-2xl items-center gap-2" @submit.prevent="submitQuestion(question)">
                <input
                    v-model="question"
                    type="text"
                    placeholder="Ask about KurrawongAI, its people, products, services or projects…"
                    aria-label="Ask a question about KurrawongAI"
                    class="bg-background h-14 flex-1 rounded-full border px-5 text-base shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                <Button type="submit" size="lg" class="size-14 shrink-0 rounded-full" aria-label="Send question" :disabled="!question.trim()">
                    <Send />
                </Button>
            </form>

            <div v-if="kchatUrl" class="flex max-w-2xl flex-wrap justify-center gap-2">
                <button
                    v-for="suggestion in KCHAT_SUGGESTIONS"
                    :key="suggestion"
                    type="button"
                    class="bg-background/80 hover:bg-accent rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm"
                    @click="submitQuestion(suggestion)"
                >
                    {{ suggestion }}
                </button>
            </div>
        </div>

        <Button
            v-show="!exploring"
            size="lg"
            class="fixed bottom-5 right-5 z-40 rounded-full pr-5 shadow-lg"
            @click="exploring = true"
        >
            <Waypoints />
            Explore the graph
        </Button>

        <template v-if="exploring">
            <div
                v-if="selectedNode"
                class="bg-card text-card-foreground fixed top-20 left-5 z-[70] max-w-sm rounded-lg border p-4 text-sm shadow-lg"
            >
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-base font-semibold !m-0">{{ selectedNode.label }}</h2>
                    <Button variant="ghost" size="icon" class="-mt-1 -mr-1 size-7" aria-label="Close details" @click="selectedNode = null">
                        <X class="size-4" />
                    </Button>
                </div>
                <p class="text-muted-foreground mt-1 text-xs">{{ selectedNode.id }}</p>
                <p v-if="selectedNode.description" class="mt-2 !my-0">{{ selectedNode.description }}</p>
                <a
                    v-if="selectedNode.url"
                    :href="selectedNode.url"
                    target="_blank"
                    rel="noopener"
                    class="mt-2 inline-block text-xs underline"
                >{{ selectedNode.url }}</a>
            </div>

            <Button size="lg" variant="outline" class="fixed bottom-5 right-5 z-[70] rounded-full pr-5 shadow-lg" @click="exploring = false">
                <X />
                Back to the site
            </Button>
        </template>
    </div>
</template>
