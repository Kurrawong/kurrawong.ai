<script lang="ts" setup>
import * as d3 from "d3";
import type { RdfGraphNode } from "@/utils/rdfGraph";

interface SimNode extends RdfGraphNode, d3.SimulationNodeDatum {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
    label: string;
}

const props = defineProps<{
    turtle: string;
    selectedId?: string | null;
}>();

const emit = defineEmits<{
    select: [node: RdfGraphNode | null];
}>();

const container = ref<HTMLElement | null>(null);
let simulation: d3.Simulation<SimNode, SimLink> | null = null;
let observer: ResizeObserver | null = null;

function render() {
    if (!container.value) return;
    const host = container.value;
    const { nodes, links } = turtleToGraph(props.turtle);
    host.replaceChildren();
    if (!nodes.length) return;

    const simNodes: SimNode[] = nodes.map(node => ({ ...node }));
    const simLinks: SimLink[] = links.map(link => ({ ...link }));

    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;

    const svg = d3.select(host).append("svg").attr("width", width).attr("height", height).classed("kgraph-svg", true);
    const g = svg.append("g");

    svg.call(
        d3.zoom<d3.SVGSVGElement, unknown>()
            .scaleExtent([0.2, 8])
            .on("zoom", event => g.attr("transform", event.transform.toString())),
    );

    const link = g
        .selectAll<SVGLineElement, SimLink>(".kgraph-link")
        .data(simLinks)
        .join("line")
        .classed("kgraph-link", true);
    link.append("title").text(d => d.label);

    const node = g
        .selectAll<SVGGElement, SimNode>(".kgraph-node")
        .data(simNodes)
        .join("g")
        .attr("class", d => `kgraph-node kgraph-type-${d.type}`);

    node.append("circle").attr("r", 10);
    node.append("title").text(d => `${d.label}\n${d.id}${d.description ? `\n\n${d.description}` : ""}`);
    node.append("text")
        .text(d => d.label)
        .attr("dy", "1.4em")
        .attr("text-anchor", "middle")
        .classed("kgraph-label", true);

    function connected(id: string): Set<string> {
        const result = new Set<string>([id]);
        for (const link of simLinks) {
            const source = typeof link.source === "string" ? link.source : link.source.id;
            const target = typeof link.target === "string" ? link.target : link.target.id;
            if (source === id) result.add(target);
            if (target === id) result.add(source);
        }
        return result;
    }

    node.on("mouseover", (event, d) => {
        const neighbours = connected(d.id);
        node.attr("data-active", n => (neighbours.has(n.id) ? "true" : null));
        link.attr("data-active", l => {
            const source = typeof l.source === "string" ? l.source : l.source.id;
            const target = typeof l.target === "string" ? l.target : l.target.id;
            return source === d.id || target === d.id ? "true" : null;
        });
    }).on("mouseout", () => {
        node.attr("data-active", null);
        link.attr("data-active", null);
    });

    node.on("click", (event, d) => {
        event.stopPropagation();
        emit("select", d);
    });
    svg.on("click", () => emit("select", null));

    const dragBehaviour = d3
        .drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
            if (!event.active) simulation?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, d) => {
            if (!event.active) simulation?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });
    node.call(dragBehaviour);

    simulation = d3
        .forceSimulation<SimNode>(simNodes)
        .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(90))
        .force("charge", d3.forceManyBody().strength(-350))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(28))
        .on("tick", () => {
            link
                .attr("x1", d => (d.source as SimNode).x ?? 0)
                .attr("y1", d => (d.source as SimNode).y ?? 0)
                .attr("x2", d => (d.target as SimNode).x ?? 0)
                .attr("y2", d => (d.target as SimNode).y ?? 0);
            node.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
        });

    observer?.disconnect();
    observer = new ResizeObserver(() => {
        const newWidth = host.clientWidth;
        const newHeight = host.clientHeight;
        if (!newWidth || !newHeight) return;
        svg.attr("width", newWidth).attr("height", newHeight);
        simulation?.force("center", d3.forceCenter(newWidth / 2, newHeight / 2)).alpha(0.3).restart();
    });
    observer.observe(host);
}

onMounted(render);
watch(() => props.turtle, render);

onBeforeUnmount(() => {
    simulation?.stop();
    observer?.disconnect();
});
</script>

<template>
    <div ref="container" class="kgraph h-full w-full" />
</template>

<style>
.kgraph-svg {
    display: block;
    cursor: grab;
}

.kgraph-svg:active {
    cursor: grabbing;
}

.kgraph-link {
    stroke: color-mix(in srgb, var(--muted-foreground) 45%, transparent);
    stroke-width: 1.5;
}

.kgraph-node circle {
    stroke: var(--background);
    stroke-width: 2;
}

.kgraph-node.kgraph-type-person circle {
    fill: var(--chart-2);
}

.kgraph-node.kgraph-type-organization circle,
.kgraph-node.kgraph-type-website circle {
    fill: var(--chart-1);
}

.kgraph-node.kgraph-type-product circle {
    fill: var(--chart-4);
}

.kgraph-node.kgraph-type-service circle {
    fill: var(--chart-3);
}

.kgraph-node.kgraph-type-project circle {
    fill: var(--chart-5);
}

.kgraph-node.kgraph-type-other circle {
    fill: var(--muted-foreground);
}

.kgraph-node circle {
    transition: r 0.15s;
}

.kgraph-node:hover circle {
    r: 14;
}

.kgraph-node:not([data-active]) circle,
.kgraph-node[data-active="true"] circle {
    opacity: 1;
}

.kgraph-node[data-active="false"] circle {
    opacity: 0.25;
}

.kgraph-link[data-active="false"] {
    opacity: 0.15;
}

.kgraph-label {
    font-size: 10px;
    fill: var(--foreground);
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 3px;
    stroke-linejoin: round;
    pointer-events: none;
    user-select: none;
}
</style>
