<script lang="ts" setup>
import { ChevronDown, ExternalLink, RotateCcw, Tags, Waypoints, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const { data: turtleData } = await useAsyncData("rdf", () => $fetch<string>("/?_mediatype=text/turtle"), {
    default: () => "",
});

const { exploring } = useGraphExplore();
const { conversationActive } = useKChatBar();
const { scrollFade } = useScrollFade();
// Fullscreen chat variant: the graph diagram is hidden and the chat fills the
// hero, so only the spacer and the scroll-down chip remain.
const { chatFullscreen } = useKChatVariant();
const selectedNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);
// The node whose page is open in the right-hand split pane; kept separately
// from selectedNode so dismissing the info popup leaves the pane alone.
const splitNode = ref<{ label: string; type: string; description?: string; url?: string; id: string } | null>(null);
// In explore mode, a node's page opens in a right-hand split pane.
const splitUrl = ref<string | null>(null);
// Half-and-half is too narrow on small screens, so pages open from the
// info box there instead.
const isSmallScreen = ref(false);
// The graph canvas: called directly by the re-cluster button.
const graphCanvas = ref<{ recluster: () => void } | null>(null);
// On small screens the explore-mode legend starts collapsed behind a pill.
const legendOpen = ref(false);

/** True when a URL points somewhere other than the KurrawongAI site. */
function isThirdPartyUrl(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return hostname !== "kurrawong.ai" && !hostname.endsWith(".kurrawong.ai");
    } catch {
        return false;
    }
}

/**
 * KurrawongAI pages open in the split pane as same-origin paths; everything
 * else returns null. Subdomains like tools.kurrawong.ai are separate sites:
 * their paths don't exist here, so they open in the info popup instead.
 */
function pageFor(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "kurrawong.ai") {
            return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
        }
        return null;
    } catch {
        // Not an absolute URL: use it as-is.
        return url;
    }
}

/** Node click: always open the info popup; open the split pane when the
 *  node's URL is a page on this site (and the screen is wide enough). */
function onNodeSelect(node: { label: string; type: string; description?: string; url?: string; id: string }) {
    selectedNode.value = node;
    splitNode.value = node;
    splitUrl.value = node.url && !isSmallScreen.value ? pageFor(node.url) : null;
}

/** Background click: dismiss the info popup only. The split pane closes via
 *  its own close button and clustering via the re-cluster button. */
function onBackgroundSelect() {
    selectedNode.value = null;
}

function closePopup() {
    selectedNode.value = null;
}

function closeSplit() {
    splitNode.value = null;
    splitUrl.value = null;
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

/** After the framed page loads, scroll to the node's section: the URL's
 *  section anchor when it has one, otherwise the heading that best matches
 *  the node's label. */
function onFrameLoad() {
    const frameEl = frame.value;
    const node = splitNode.value;
    if (!frameEl || !node || !splitUrl.value) return;
    try {
        const win = frameEl.contentWindow;
        const doc = frameEl.contentDocument;
        // Only scroll the page this pane was opened for, not in-frame navigation.
        if (!win || !doc || !win.location.pathname.startsWith(splitUrl.value.split("#")[0])) return;
        const hash = splitUrl.value.split("#")[1] ?? "";
        const section = (hash ? doc.getElementById(hash) : null) ?? relevantSection(doc, node.label);
        if (!section) return;
        // Keep the section clear of the page's sticky header inside the frame.
        const top = section.getBoundingClientRect().top + win.scrollY - 80;
        win.scrollTo({ top: Math.max(0, top) });
    } catch {
        // Cross-origin frame: nothing to scroll.
    }
}

// The frame's load event waits for every image before firing, which makes
// the section scroll feel like it is never coming. The framed page is
// same-origin, so poll for the target element and scroll as soon as the
// parser has reached it; onFrameLoad then re-adjusts once the layout is
// final.
let frameTargetTimer: ReturnType<typeof setInterval> | null = null;

function stopFrameTargetWatch() {
    if (frameTargetTimer !== null) {
        clearInterval(frameTargetTimer);
        frameTargetTimer = null;
    }
}

function watchFrameTarget() {
    stopFrameTargetWatch();
    const url = splitUrl.value;
    const hash = url?.split("#")[1] ?? "";
    if (!url || !hash) return;
    let tries = 0;
    frameTargetTimer = setInterval(() => {
        const frameEl = frame.value;
        tries += 1;
        if (!frameEl || tries > 300) {
            stopFrameTargetWatch();
            return;
        }
        try {
            const doc = frameEl.contentDocument;
            const win = frameEl.contentWindow;
            const section = doc?.getElementById(hash);
            if (!doc || !win || !section) return;
            const top = section.getBoundingClientRect().top + win.scrollY - 80;
            win.scrollTo({ top: Math.max(0, top) });
            stopFrameTargetWatch();
        } catch {
            stopFrameTargetWatch();
        }
    }, 50);
}

watch(splitUrl, watchFrameTarget);

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
    // The small-screen backdrop is blurred harder, so dim it a little too.
    const dim = isSmallScreen.value ? 0.7 : 1;
    return { opacity: base * dim * scrollFade.value };
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
    if (!value) {
        selectedNode.value = null;
        splitNode.value = null;
        splitUrl.value = null;
        legendOpen.value = false;
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    document.body.style.overflow = "";
    stopFrameTargetWatch();
});
</script>

<template>
    <div class="relative -mx-5 not-prose rounded-lg min-h-[calc(100svh-4.5rem)]">
        <!-- Fullscreen backdrop behind all page content (negative z-index),
             fading out as the page scrolls past the hero. Hidden in the
             fullscreen chat variant, where the chat takes the hero instead. -->
        <div
            v-if="!chatFullscreen"
            class="transition-all duration-150"
            :class="exploring
                ? (splitUrl
                    ? 'fixed inset-y-0 left-0 z-[60] w-full bg-background blur-0 sm:w-1/2'
                    : 'fixed inset-0 z-[60] bg-background blur-0')
                : 'fixed inset-0 -z-10 blur-[8px] sm:blur-[2px] pointer-events-none'"
            :style="backdropStyle"
        >
            <ClientOnly>
                <KGraphCanvas ref="graphCanvas" :turtle="turtleData" :constrained="!exploring" @select="node => (node ? onNodeSelect(node) : onBackgroundSelect())" />
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
            v-if="!chatFullscreen"
            v-show="!exploring && scrollFade > 0"
            size="lg"
            class="fixed bottom-5 right-5 z-[90] max-sm:h-10 max-sm:px-3 max-sm:text-sm pr-5 shadow-lg"
            @click="exploring = true"
        >
            <Waypoints />
            Explore<span class="max-sm:hidden"> the graph</span>
        </Button>

        <template v-if="exploring">
            <!-- Re-cluster control. Background clicks never re-cluster (they
                 happen too easily by accident); this is the only way back to
                 the clustered overview. -->
            <Button
                size="sm"
                variant="outline"
                class="fixed top-5 z-[70] h-9 shadow-lg"
                :class="splitUrl ? 'right-[calc(50%+1.25rem)]' : 'right-5'"
                @click="graphCanvas?.recluster()"
            >
                <RotateCcw />
                Re-cluster
            </Button>

            <!-- Small screens: the legend starts as a collapsed pill at the
                 bottom left so it stays clear of the other buttons. -->
            <Button
                v-if="isSmallScreen && !legendOpen"
                size="sm"
                variant="outline"
                class="fixed bottom-5 left-5 z-[70] h-9 shadow-lg"
                @click="legendOpen = true"
            >
                <Tags />
                Legend
            </Button>
            <div
                v-show="!isSmallScreen || legendOpen"
                class="bg-card/90 fixed bottom-5 left-5 z-[70] max-w-[calc(100vw-2.5rem)] rounded-lg border p-3 text-xs shadow-lg backdrop-blur-sm"
                aria-label="Diagram legend"
            >
                <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span v-for="item in LEGEND" :key="item.type" class="flex items-center gap-1.5">
                        <span class="kgraph-legend-dot" :class="`kgraph-legend-${item.type}`" />
                        {{ item.label }}
                    </span>
                </div>
                <p class="text-muted-foreground mt-2 max-w-56 max-sm:hidden">
                    Click a cluster to expand its nodes; use the re-cluster button to group them again. Drag to arrange, scroll to zoom.
                </p>
                <p class="text-muted-foreground mt-2 max-w-56 sm:hidden">
                    Tap a cluster to expand its nodes; use the re-cluster button to group them again. Drag to arrange, pinch to zoom.
                </p>
                <Button v-if="isSmallScreen" variant="ghost" size="icon" class="-mr-1 -mb-1 size-7 shrink-0" aria-label="Collapse legend" @click="legendOpen = false">
                    <ChevronDown class="size-4" />
                </Button>
            </div>

            <!-- Split view: the clicked node's page on the right, graph on the left. -->
            <div
                v-if="splitUrl"
                class="bg-card text-card-foreground fixed inset-y-0 right-0 z-[80] flex w-full flex-col border-l shadow-xl sm:w-1/2"
            >
                <div class="flex items-center justify-between gap-2 border-b px-4 py-3">
                    <div class="min-w-0">
                        <h2 class="truncate text-sm font-semibold !m-0">{{ splitNode?.label ?? "Page" }}</h2>
                        <p class="text-muted-foreground truncate text-xs !my-0">{{ splitUrl }}</p>
                    </div>
                    <Button variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close page view" @click="closeSplit()">
                        <X class="size-4" />
                    </Button>
                </div>
                <iframe
                    ref="frame"
                    :src="splitUrl"
                    class="bg-background w-full flex-1"
                    :title="`KurrawongAI page: ${splitNode?.label ?? splitUrl}`"
                    @load="onFrameLoad"
                />
            </div>

            <!-- Info popup: always opened by a node click; anchored top-left
                 on desktop so it stays clear of the split pane. -->
            <div
                v-if="selectedNode"
                class="bg-card text-card-foreground fixed top-5 left-5 z-[70] max-w-sm max-sm:inset-x-5 max-sm:top-16 max-sm:max-w-none max-sm:max-h-[55vh] max-sm:overflow-y-auto rounded-lg border p-4 text-sm shadow-lg"
            >
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-base font-semibold !m-0">{{ selectedNode.label }}</h2>
                    <Button variant="ghost" size="icon" class="-mt-1 -mr-1 size-7" aria-label="Close details" @click="closePopup()">
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
                    class="mt-2 inline-flex items-center gap-1 break-all text-xs underline"
                >
                    {{ selectedNode.url }}
                    <ExternalLink v-if="isThirdPartyUrl(selectedNode.url)" class="size-3" aria-label="External site" />
                </a>
            </div>

            <Button
                size="lg"
                variant="outline"
                class="fixed bottom-5 z-[70] pr-5 shadow-lg max-sm:size-10 max-sm:p-0"
                :class="splitUrl ? 'right-[calc(50%+1.25rem)] max-sm:right-5' : 'right-5'"
                aria-label="Back to the site"
                @click="exploring = false"
            >
                <X />
                <span class="max-sm:hidden">Back to the site</span>
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
    background: var(--kgraph-person);
}

.kgraph-legend-organization {
    background: var(--kgraph-organization);
}

.kgraph-legend-product {
    background: var(--kgraph-product);
}

.kgraph-legend-service {
    background: var(--kgraph-service);
}

.kgraph-legend-project {
    background: var(--kgraph-project);
}

.kgraph-legend-other {
    background: var(--muted-foreground);
}
</style>
