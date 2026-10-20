<script lang="ts" setup>
import { ChevronDown, ExternalLink, Waypoints, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const { exploring } = useGraphExplore();
const { conversationActive } = useKChatBar();
const { scrollFade } = useScrollFade();
const selectedNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);
// In explore mode, a node's page opens in a right-hand split pane.
const splitUrl = ref<string | null>(null);
// Half-and-half is too narrow on small screens, so pages open from the
// info box there instead.
const isSmallScreen = ref(false);

/** True when a URL points somewhere other than the KurrawongAI site. */
function isThirdPartyUrl(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return hostname !== "kurrawong.ai" && !hostname.endsWith(".kurrawong.ai");
    } catch {
        return false;
    }
}

/** KurrawongAI pages open in the split pane as same-origin paths; third-party URLs return null. */
function pageFor(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "kurrawong.ai" || parsed.hostname.endsWith(".kurrawong.ai")) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
        }
        return null;
    } catch {
        // Not an absolute URL: use it as-is.
        return url;
    }
}

function onNodeSelect(node: { label: string; type: string; description?: string; url?: string; id: string } | null) {
    selectedNode.value = node;
    splitUrl.value = node?.url && !isSmallScreen.value ? pageFor(node.url) : null;
}

const frame = ref<HTMLIFrameElement | null>(null);

function normalise(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** The heading inside the framed page that best matches the node's label. */
function relevantSection(doc: Document, label: string): HTMLElement | null {
    const target = normalise(label);
    if (!target) return null;
    let best: { element: HTMLElement; score: number } | null = null;
    for (const element of Array.from(doc.querySelectorAll<HTMLElement>("h1, h2, h3, h4"))) {
        const text = normalise(element.textContent ?? "");
        if (!text) continue;
        let score = 0;
        if (text === target) score = 100;
        else if (target.includes(text) || text.includes(target)) score = 70;
        else {
            const words = new Set(text.split(" "));
            score = target.split(" ").filter(word => word.length > 2 && words.has(word)).length;
        }
        if (!best || score > best.score) best = { element, score };
    }
    return best && best.score >= 2 ? best.element : null;
}

/** After the framed page loads, scroll to the section about the clicked node. */
function onFrameLoad() {
    const frameEl = frame.value;
    const node = selectedNode.value;
    if (!frameEl || !node || !splitUrl.value) return;
    try {
        const win = frameEl.contentWindow;
        const doc = frameEl.contentDocument;
        // Only scroll the page this pane was opened for, not in-frame navigation.
        if (!win || !doc || !win.location.pathname.startsWith(splitUrl.value.split("#")[0])) return;
        const section = relevantSection(doc, node.label);
        if (!section) return;
        section.scrollIntoView({ block: "start" });
        // Keep the section clear of the page's sticky header inside the frame.
        win.scrollBy({ top: -80 });
    } catch {
        // Cross-origin frame: nothing to scroll.
    }
}

const LEGEND = [
    { label: "People", type: "person" },
    { label: "Organization", type: "organization" },
    { label: "Products", type: "product" },
    { label: "Services", type: "service" },
    { label: "Projects", type: "project" },
    { label: "External / other", type: "other" },
];

const colorMode = useColorMode();

function onScroll() {
    // Fade out as soon as the user scrolls, fully gone after a short distance.
    const end = window.innerHeight * 0.35;
    const progress = window.scrollY / end;
    scrollFade.value = Math.min(1, Math.max(0, 1 - progress));
}

const backdropStyle = computed(() => {
    if (exploring.value) return undefined;
    const base = colorMode.value === "dark" ? 0.3 : 0.45;
    return { opacity: base * scrollFade.value };
});

function scrollDown() {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
}

onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const media = window.matchMedia("(max-width: 639px)");
    isSmallScreen.value = media.matches;
    media.addEventListener("change", event => {
        isSmallScreen.value = event.matches;
        if (event.matches) splitUrl.value = null;
    });
});

watch(exploring, value => {
    document.body.style.overflow = value ? "hidden" : "";
    if (!value) onNodeSelect(null);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    document.body.style.overflow = "";
});
</script>

<template>
    <div class="relative -mx-5 not-prose rounded-lg min-h-[calc(100svh-4.5rem)]">
        <!-- Fullscreen backdrop behind all page content (negative z-index),
             fading out as the page scrolls past the hero. -->
        <div
            class="transition-all duration-150"
            :class="exploring
                ? (splitUrl
                    ? 'fixed inset-y-0 left-0 z-[60] w-full bg-background blur-0 sm:w-1/2'
                    : 'fixed inset-0 z-[60] bg-background blur-0')
                : 'fixed inset-0 -z-10 blur-[2px] pointer-events-none'"
            :style="backdropStyle"
        >
            <ClientOnly>
                <KGraphCanvas :turtle="turtleData" :constrained="!exploring" :split-open="!!splitUrl" @select="onNodeSelect" />
            </ClientOnly>
        </div>

        <Button
            v-show="!exploring && scrollFade > 0"
            variant="ghost"
            size="icon"
            class="bg-card/80 fixed bottom-3 left-1/2 z-[90] size-10 -translate-x-1/2 rounded-md border shadow-lg backdrop-blur-sm"
            aria-label="Scroll down for more content"
            title="Scroll down for more"
            @click="scrollDown"
        >
            <ChevronDown class="size-6" :class="conversationActive ? '' : 'khero-bounce'" />
        </Button>

        <Button
            v-show="!exploring && scrollFade > 0"
            size="lg"
            class="fixed bottom-5 right-5 z-[90] pr-5 shadow-lg"
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
                    Click a cluster to expand its nodes; click the background to cluster them again. Larger outlined nodes open their website page beside the diagram. Drag to arrange, scroll to zoom.
                </p>
            </div>

            <!-- Split view: the clicked node's page on the right, graph on the left. -->
            <div
                v-if="splitUrl"
                class="bg-card text-card-foreground fixed inset-y-0 right-0 z-[80] flex w-full flex-col border-l shadow-xl sm:w-1/2"
            >
                <div class="flex items-center justify-between gap-2 border-b px-4 py-3">
                    <div class="min-w-0">
                        <h2 class="truncate text-sm font-semibold !m-0">{{ selectedNode?.label ?? "Page" }}</h2>
                        <p class="text-muted-foreground truncate text-xs !my-0">{{ splitUrl }}</p>
                    </div>
                    <Button variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close page view" @click="onNodeSelect(null)">
                        <X class="size-4" />
                    </Button>
                </div>
                <iframe
                    ref="frame"
                    :src="splitUrl"
                    class="bg-background w-full flex-1"
                    :title="`KurrawongAI page: ${selectedNode?.label ?? splitUrl}`"
                    @load="onFrameLoad"
                />
            </div>

            <div
                v-if="selectedNode && !splitUrl"
                class="bg-card text-card-foreground fixed top-20 right-5 z-[70] max-w-sm rounded-lg border p-4 text-sm shadow-lg"
            >
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-base font-semibold !m-0">{{ selectedNode.label }}</h2>
                    <Button variant="ghost" size="icon" class="-mt-1 -mr-1 size-7" aria-label="Close details" @click="onNodeSelect(null)">
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
                    class="mt-2 inline-flex items-center gap-1 text-xs underline"
                >
                    {{ selectedNode.url }}
                    <ExternalLink v-if="isThirdPartyUrl(selectedNode.url)" class="size-3" aria-label="External site" />
                </a>
            </div>

            <Button
                size="lg"
                variant="outline"
                class="fixed bottom-5 z-[70] pr-5 shadow-lg"
                :class="splitUrl ? 'right-[calc(50%+1.25rem)] max-sm:right-5' : 'right-5'"
                @click="exploring = false"
            >
                <X />
                Back to the site
            </Button>
        </template>
    </div>
</template>

<style scoped>
/* Bounce evenly around the resting position so the icon stays centred. */
.khero-bounce {
    animation: khero-bounce 1s ease-in-out infinite;
}

@keyframes khero-bounce {
    0%, 100% {
        transform: translateY(-12.5%);
    }
    50% {
        transform: translateY(12.5%);
    }
}

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
