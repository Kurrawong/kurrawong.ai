<script lang="ts" setup>
import { ChevronDown, Waypoints, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const { exploring } = useGraphExplore();
const selectedNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);

const LEGEND = [
    { label: "People", type: "person" },
    { label: "Organization", type: "organization" },
    { label: "Products", type: "product" },
    { label: "Services", type: "service" },
    { label: "Projects", type: "project" },
    { label: "External / other", type: "other" },
];

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
    <div class="relative -mx-5 not-prose overflow-hidden rounded-lg min-h-[calc(100svh-4.5rem)]">
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
                class="bg-card/90 fixed bottom-5 left-5 z-[70] rounded-lg border p-3 text-xs shadow-lg backdrop-blur-sm"
                aria-label="Diagram legend"
            >
                <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span v-for="item in LEGEND" :key="item.type" class="flex items-center gap-1.5">
                        <span class="kgraph-legend-dot" :class="`kgraph-legend-${item.type}`" />
                        {{ item.label }}
                    </span>
                </div>
                <p class="text-muted-foreground mt-2 max-w-56">
                    Larger outlined nodes link to website pages. Drag nodes to arrange, scroll to zoom, click a node for details.
                </p>
            </div>

            <div
                v-if="selectedNode"
                class="bg-card text-card-foreground fixed top-20 right-5 z-[70] max-w-sm rounded-lg border p-4 text-sm shadow-lg"
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

<style scoped>
.kgraph-legend-dot {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 9999px;
    flex-shrink: 0;
}

.kgraph-legend-person {
    background: var(--chart-2);
}

.kgraph-legend-organization {
    background: var(--chart-1);
}

.kgraph-legend-product {
    background: var(--chart-4);
}

.kgraph-legend-service {
    background: var(--chart-3);
}

.kgraph-legend-project {
    background: var(--chart-5);
}

.kgraph-legend-other {
    background: var(--muted-foreground);
}
</style>
