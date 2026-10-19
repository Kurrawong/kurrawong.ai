<script lang="ts" setup>
import * as d3 from "d3";
import type { RdfGraphNode } from "@/utils/rdfGraph";

interface SimNode extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    type: string;
    cluster: string;
    description?: string;
    url?: string;
    isCluster?: boolean;
    count?: number;
    r: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {}

const props = defineProps<{
    turtle: string;
}>();

const emit = defineEmits<{
    select: [node: RdfGraphNode | null];
}>();

const CLUSTER_LABELS: Record<string, string> = {
    person: "People",
    organization: "Organization",
    product: "Products",
    service: "Services",
    project: "Projects",
    other: "External / other",
};

function clusterOf(node: RdfGraphNode): string {
    const iri = node.id;
    if (iri.startsWith("https://kurrawong.ai/people/#") || node.type === "person") return "person";
    if (iri.startsWith("https://kurrawong.ai/products/#")) return "product";
    if (iri.startsWith("https://kurrawong.ai/services/#")) return "service";
    if (iri.startsWith("https://kurrawong.ai/projects/#")) return "project";
    if (node.type === "organization" || node.type === "website") return "organization";
    return "other";
}

const container = ref<HTMLElement | null>(null);
const { exploring } = useGraphExplore();
// Clusters the user has expanded while exploring. Outside explore mode the
// diagram always shows every node unclustered.
const userExpanded = new Set<string>();
const lastPositions = new Map<string, { x: number; y: number }>();
const previousVisible = new Set<string>();
let simulation: d3.Simulation<SimNode, SimLink> | null = null;
let observer: ResizeObserver | null = null;

/** Entering explore mode clusters the diagram; leaving it shows all nodes. */
watch(exploring, () => {
    userExpanded.clear();
    render();
});

function render() {
    if (!container.value) return;
    const host = container.value;
    const { nodes: allNodes, links: allLinks } = turtleToGraph(props.turtle);
    host.replaceChildren();
    if (!allNodes.length) return;

    const membersByCluster = new Map<string, RdfGraphNode[]>();
    for (const node of allNodes) {
        const cluster = clusterOf(node);
        const members = membersByCluster.get(cluster) ?? [];
        members.push(node);
        membersByCluster.set(cluster, members);
    }

    // Visible nodes: an expanded cluster shows its members, otherwise one
    // aggregate node per cluster. All clusters are expanded unless exploring.
    const expandedClusters = new Set(exploring.value ? userExpanded : membersByCluster.keys());

    // Clusters expanded since the previous render: their members burst out
    // of the cluster's last position.
    const justExpanded = new Set<string>();
    for (const cluster of userExpanded) {
        if (previousVisible.has(`cluster:${cluster}`)) justExpanded.add(cluster);
    }

    const simNodes: SimNode[] = [];
    const idToVisible = new Map<string, SimNode>();
    for (const [cluster, members] of membersByCluster) {
        if (expandedClusters.has(cluster)) {
            for (const member of members) {
                const simNode: SimNode = { ...member, cluster, isCluster: false, r: member.url ? 12 : 7 };
                simNodes.push(simNode);
                idToVisible.set(member.id, simNode);
            }
        } else {
            const r = 14 + Math.min(24, members.length * 2);
            const simNode: SimNode = {
                id: `cluster:${cluster}`,
                label: `${CLUSTER_LABELS[cluster] ?? cluster} (${members.length})`,
                type: cluster,
                cluster,
                isCluster: true,
                count: members.length,
                r,
                description: `${members.length} ${CLUSTER_LABELS[cluster] ?? cluster}. Click to show the individual nodes.`,
            };
            simNodes.push(simNode);
            for (const member of members) idToVisible.set(member.id, simNode);
        }
    }

    // Seed positions: keep previous positions for stable layout, start
    // just-expanded members at their cluster's position, and place a
    // just-collapsed cluster at the centroid of its members.
    for (const simNode of simNodes) {
        if (simNode.isCluster) continue;
        if (justExpanded.has(simNode.cluster)) continue;
        const seed = lastPositions.get(simNode.id);
        if (seed) {
            simNode.x = seed.x;
            simNode.y = seed.y;
        }
    }
    for (const simNode of simNodes) {
        if (simNode.isCluster) continue;
        if (simNode.x !== undefined) continue;
        const clusterPos = lastPositions.get(`cluster:${simNode.cluster}`);
        if (clusterPos) {
            simNode.x = clusterPos.x;
            simNode.y = clusterPos.y;
        }
    }
    for (const [cluster, members] of membersByCluster) {
        if (expandedClusters.has(cluster)) continue;
        const clusterNode = simNodes.find(node => node.id === `cluster:${cluster}`);
        if (!clusterNode || clusterNode.x !== undefined) continue;
        const positioned = members.map(member => lastPositions.get(member.id)).filter(Boolean) as { x: number; y: number }[];
        if (positioned.length) {
            clusterNode.x = positioned.reduce((sum, position) => sum + position.x, 0) / positioned.length;
            clusterNode.y = positioned.reduce((sum, position) => sum + position.y, 0) / positioned.length;
        }
    }

    // Visible links: endpoints collapse to their cluster unless expanded.
    const simLinks: SimLink[] = [];
    const seenLinks = new Set<string>();
    for (const link of allLinks) {
        const source = idToVisible.get(link.source);
        const target = idToVisible.get(link.target);
        if (!source || !target || source === target) continue;
        const key = source.id < target.id ? `${source.id}|${target.id}` : `${target.id}|${source.id}`;
        if (seenLinks.has(key)) continue;
        seenLinks.add(key);
        simLinks.push({ source: source.id, target: target.id });
    }

    const entering = new Set(simNodes.filter(node => !previousVisible.has(node.id)).map(node => node.id));
    previousVisible.clear();
    for (const node of simNodes) previousVisible.add(node.id);

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

    const node = g
        .selectAll<SVGGElement, SimNode>(".kgraph-node")
        .data(simNodes)
        .join("g")
        .attr("class", d => `kgraph-node kgraph-type-${d.type}${d.isCluster ? " kgraph-cluster" : ""}${d.url && !d.isCluster ? " kgraph-key" : ""}`)
        .attr("opacity", d => (entering.has(d.id) ? 0 : 1))
        .transition()
        .duration(300)
        .attr("opacity", 1)
        .selection();

    node.append("circle").attr("r", d => d.r);
    node.append("title").text(d => `${d.label}\n${d.id}${d.description ? `\n\n${d.description}` : ""}`);
    node.append("text")
        .text(d => d.label)
        .attr("dy", d => d.r + 14)
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
        if (d.isCluster) {
            userExpanded.add(d.cluster);
            render();
        } else {
            emit("select", { id: d.id, label: d.label, type: d.type, description: d.description, url: d.url });
        }
    });
    svg.on("click", () => {
        if (userExpanded.size) {
            userExpanded.clear();
            render();
        }
        emit("select", null);
    });

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
        .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-350))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide<SimNode>(d => d.r + 10))
        .on("tick", () => {
            for (const d of simNodes) lastPositions.set(d.id, { x: d.x ?? 0, y: d.y ?? 0 });
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

.kgraph-node.kgraph-key circle {
    stroke: var(--foreground);
    stroke-width: 2.5;
}

.kgraph-node.kgraph-key {
    cursor: pointer;
}

.kgraph-cluster {
    cursor: pointer;
}

.kgraph-cluster circle {
    stroke: var(--foreground);
    stroke-width: 2.5;
}

/* Base dimming; hover states below override it. */
.kgraph-node:not(.kgraph-key):not(.kgraph-cluster) circle {
    opacity: 0.75;
}

.kgraph-cluster circle {
    opacity: 0.95;
}

.kgraph-node circle {
    transition: r 0.15s;
}

.kgraph-node:not(.kgraph-cluster):hover circle {
    r: 15;
}

.kgraph-node[data-active="true"] circle {
    opacity: 1;
}

.kgraph-svg .kgraph-node[data-active="false"] circle {
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
