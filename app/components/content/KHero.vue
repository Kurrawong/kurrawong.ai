<script lang="ts" setup>
import { VisSingleContainer, VisGraph } from "@unovis/vue";
import { type GraphLinkLabel, type GraphConfigInterface, Graph, GraphNodeSelectionHighlightMode, type GraphNode as Node, type VisEventType } from "@unovis/ts";
import { Eye, EyeClosed } from "lucide-vue-next";
import { useWindowSize } from "@vueuse/core";

const { width: windowWidth } = useWindowSize();

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const showLabels = ref(false);
const selectedNodeId = ref<string | number | undefined>(undefined);

const data = computed(() => rdfToChart(turtleData.value));

const nodeLabel = (n: GraphNode, i: number) => n.label;
const linkLabel = (l: GraphLink, i: number): GraphLinkLabel => ({ text: l.label });

const options: GraphConfigInterface<GraphNode, GraphLink> = {
    nodeSize: 20,
    linkWidth: 2,
    nodeFill: (n: GraphNode, i: number) => n.type === "node" ? "hsl(47.9, 95.8%, 53.1%)" : (n.type === "bnode" ? "transparent" : "#12100e"),
    linkArrow: true,
    forceLayoutSettings: {
        charge: -1000,
        forceYStrength: 0.4,
        linkDistance: 80,
        // linkStrength: 0.7,
    },
    nodeSelectionHighlightMode: GraphNodeSelectionHighlightMode.GreyoutNonConnected,
};

// Record<keyof Graph.selectors, Record<VisEventType, () => void>>

// {[key: Graph.selectors]: {[eventType: VisEventType]: () => void}}

const events = {
    [Graph.selectors.node]: {
        click: (n: Node<GraphNode>) => selectedNodeId.value = n.id,
        // mouseover: (n: Node<GraphNode>) => {
        //     console.log(n._index)
        // },
    },
    [Graph.selectors.background]: {
        click: () => selectedNodeId.value = undefined,
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center p-4 -mx-4 relative h-[350px] sm:h-[450px]">
        <div class="flex flex-col gap-2 absolute top-4 pointer-events-none z-10 bg-secondary/20 backdrop-blur-sm p-4 rounded-lg">
            <h1 class="text-5xl sm:text-6xl font-bold text-foreground !m-0">Graphs, Models, AI?</h1>
            <h1 class="text-5xl sm:text-6xl font-bold text-foreground !m-0">Hello KurrawongAI!</h1>
        </div>
        <VisSingleContainer :data="data" :height="windowWidth < 640 ? 300 : 400">
            <VisGraph
                v-bind="options"
                :nodeLabel="showLabels ? nodeLabel : undefined"
                :linkLabel="showLabels ? linkLabel : undefined"
                :selectedNodeId="selectedNodeId"
                :events="events"
            />
        </VisSingleContainer>
        <Button variant="ghost" size="icon" @click="showLabels = !showLabels" title="Toggle labels"
            class="absolute right-4 bottom-4">
            <EyeClosed v-if="showLabels" class="size-4" />
            <Eye v-else class="size-4" />
        </Button>
    </div>
</template>
