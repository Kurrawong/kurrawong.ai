<script lang="ts" setup>
import { ChevronDown, Waypoints, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const summary = computed(() => turtleToSummary(turtleData.value));

const exploring = ref(false);
const selectedNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);

function scrollDown() {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
}

watch(exploring, value => {
    document.body.style.overflow = value ? "hidden" : "";
    if (!value) selectedNode.value = null;
});

onBeforeUnmount(() => {
    document.body.style.overflow = "";
});
</script>

<template>
    <div class="relative -mx-5 not-prose overflow-hidden rounded-lg min-h-[calc(100svh-4.5rem)] flex">
        <div
            class="absolute inset-0 transition-all duration-500"
            :class="exploring
                ? 'fixed inset-0 z-[60] bg-background blur-0 opacity-100'
                : 'opacity-45 blur-[2px] pointer-events-none dark:opacity-30'"
        >
            <ClientOnly>
                <KGraphCanvas :turtle="turtleData" @select="selectedNode = $event" />
            </ClientOnly>
        </div>

        <div v-show="!exploring" class="relative z-10 m-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
            <div class="flex flex-col gap-2">
                <h1 class="text-5xl font-bold text-foreground !m-0 sm:text-6xl">Graphs, Models, AI?</h1>
                <p class="text-xl text-muted-foreground !m-0">Hello KurrawongAI!</p>
            </div>

            <p v-if="summary" class="bg-secondary/50 dark:bg-secondary/30 max-w-xl rounded-lg p-3 text-sm leading-relaxed !my-0 backdrop-blur-sm">
                {{ summary.description }}
            </p>
        </div>

        <Button
            v-show="!exploring"
            variant="ghost"
            size="icon"
            class="fixed bottom-3 left-1/2 z-40 -translate-x-1/2"
            aria-label="Scroll down for more content"
            title="Scroll down for more"
            @click="scrollDown"
        >
            <ChevronDown class="size-6 animate-bounce" />
        </Button>

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
