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

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
    /** Predicates of the RDF statements this visible edge represents. */
    labels: string[];
}

const props = defineProps<{
    turtle: string;
    /** Backdrop mode: keep nodes below the site header instead of behind it. */
    constrained?: boolean;
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
// On small screens the blurred backdrop shows clusters only: every single
// node is too much clutter behind the intro text.
const isSmallScreen = ref(false);
// Clusters the user has expanded while exploring. Outside explore mode the
// diagram shows every node unclustered on desktop and the clustered
// overview on small screens.
const userExpanded = new Set<string>();
const lastPositions = new Map<string, { x: number; y: number }>();
const previousVisible = new Set<string>();
let simulation: d3.Simulation<SimNode, SimLink> | null = null;
let observer: ResizeObserver | null = null;

/** Collapse every expanded cluster back into aggregate nodes. */
function recluster() {
    userExpanded.clear();
    render();
}

defineExpose({ recluster });

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
    // aggregate node per cluster. All clusters are expanded unless exploring,
    // or unless the small-screen backdrop shows the clustered overview.
    let expandedClusters: Set<string>;
    if (exploring.value) expandedClusters = new Set(userExpanded);
    else if (isSmallScreen.value) expandedClusters = new Set();
    else expandedClusters = new Set(membersByCluster.keys());

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
    // Parallel statements between the same pair merge into one edge whose
    // labels are all its predicates.
    const simLinks: SimLink[] = [];
    const linkByKey = new Map<string, SimLink>();
    for (const link of allLinks) {
        const source = idToVisible.get(link.source);
        const target = idToVisible.get(link.target);
        if (!source || !target || source === target) continue;
        const key = source.id < target.id ? `${source.id}|${target.id}` : `${target.id}|${source.id}`;
        const simLink = linkByKey.get(key);
        if (simLink) {
            if (!simLink.labels.includes(link.label)) simLink.labels.push(link.label);
            continue;
        }
        const newLink: SimLink = { source: source.id, target: target.id, labels: [link.label] };
        linkByKey.set(key, newLink);
        simLinks.push(newLink);
    }

    const entering = new Set(simNodes.filter(node => !previousVisible.has(node.id)).map(node => node.id));
    previousVisible.clear();
    for (const node of simNodes) previousVisible.add(node.id);

    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;

    // Outside explore mode the diagram is a blurred backdrop, so its node
    // labels stay hidden; explore mode shows them as before.
    const svg = d3
        .select(host)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("kgraph-svg", true)
        .classed("kgraph-unlabelled", !exploring.value);
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

    // Edge labels sit above the links and below the nodes; they are hidden
    // until a node hover reveals the labels of its connected edges.
    const edgeLabel = g
        .append("g")
        .selectAll<SVGTextElement, SimLink>(".kgraph-edge-label")
        .data(simLinks)
        .join("text")
        .classed("kgraph-edge-label", true)
        .attr("dy", "-0.4em")
        .text(d => {
            const text = d.labels.join(" · ");
            return text.length > 40 ? `${text.slice(0, 39)}…` : text;
        });

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
        .attr("dy", d => d.r + 16)
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
        edgeLabel.attr("data-active", l => {
            const source = typeof l.source === "string" ? l.source : l.source.id;
            const target = typeof l.target === "string" ? l.target : l.target.id;
            return source === d.id || target === d.id ? "true" : null;
        });
    }).on("mouseout", () => {
        node.attr("data-active", null);
        link.attr("data-active", null);
        edgeLabel.attr("data-active", null);
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
        // A background click only dismisses the info popup. Re-clustering is
        // the re-cluster button's job, and the split pane closes via its own
        // close button.
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

    // In backdrop mode keep nodes inside the area below the sticky header.
    function topBound(): number {
        if (!props.constrained) return 0;
        return document.querySelector<HTMLElement>("header.top-nav")?.offsetHeight ?? 0;
    }

    // Spread but calm: long link springs and strong, wide-ranging repulsion
    // push nodes apart, centre snap keeps the cloud anchored, and heavier
    // velocity damping stops the larger layout from oscillating.
    simulation = d3
        .forceSimulation<SimNode>(simNodes)
        .velocityDecay(0.45)
        .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(220))
        .force("charge", d3.forceManyBody().strength(-550).distanceMax(600))
        .force("center", d3.forceCenter(width / 2, (topBound() + height) / 2))
        .force("collide", d3.forceCollide<SimNode>(d => d.r + 22).iterations(2))
        .on("tick", () => {
            if (props.constrained) {
                const top = topBound() + 8;
                for (const d of simNodes) {
                    d.x = Math.min(Math.max(d.x ?? 0, d.r + 8), width - d.r - 8);
                    d.y = Math.min(Math.max(d.y ?? 0, top + d.r), height - d.r - 8);
                }
            }
            for (const d of simNodes) lastPositions.set(d.id, { x: d.x ?? 0, y: d.y ?? 0 });
            link
                .attr("x1", d => (d.source as SimNode).x ?? 0)
                .attr("y1", d => (d.source as SimNode).y ?? 0)
                .attr("x2", d => (d.target as SimNode).x ?? 0)
                .attr("y2", d => (d.target as SimNode).y ?? 0);
            edgeLabel.attr("transform", d => {
                const source = d.source as SimNode;
                const target = d.target as SimNode;
                return `translate(${((source.x ?? 0) + (target.x ?? 0)) / 2},${((source.y ?? 0) + (target.y ?? 0)) / 2})`;
            });
            node.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
        });

    observer?.disconnect();
    observer = new ResizeObserver(() => {
        const newWidth = host.clientWidth;
        const newHeight = host.clientHeight;
        if (!newWidth || !newHeight) return;
        svg.attr("width", newWidth).attr("height", newHeight);
        simulation?.force("center", d3.forceCenter(newWidth / 2, (topBound() + newHeight) / 2)).alpha(0.3).restart();
    });
    observer.observe(host);
}

onMounted(() => {
    const media = window.matchMedia("(max-width: 639px)");
    isSmallScreen.value = media.matches;
    media.addEventListener("change", event => {
        isSmallScreen.value = event.matches;
        render();
    });
    render();
});
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
    fill: var(--kgraph-person);
}

.kgraph-node.kgraph-type-organization circle,
.kgraph-node.kgraph-type-website circle {
    fill: var(--kgraph-organization);
}

.kgraph-node.kgraph-type-product circle {
    fill: var(--kgraph-product);
}

.kgraph-node.kgraph-type-service circle {
    fill: var(--kgraph-service);
}

.kgraph-node.kgraph-type-project circle {
    fill: var(--kgraph-project);
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

.kgraph-unlabelled .kgraph-label {
    opacity: 0;
}

.kgraph-label {
    font-size: 12px;
    font-weight: 500;
    fill: var(--foreground);
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 3.5px;
    stroke-linejoin: round;
    pointer-events: none;
    user-select: none;
}

.kgraph-edge-label {
    font-size: 10.5px;
    fill: var(--foreground);
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 3.5px;
    stroke-linejoin: round;
    text-anchor: middle;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    user-select: none;
}

.kgraph-edge-label[data-active="true"] {
    opacity: 1;
}
</style>
