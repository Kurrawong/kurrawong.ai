<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import {
    ArrowRight,
    BookOpen,
    Bot,
    CheckCircle,
    Hammer,
    LifeBuoy,
    MapPin,
    Network,
    Shapes,
    Sparkles,
    Terminal,
    Waypoints,
    Workflow,
} from "lucide-vue-next";
import { NuxtLink } from "#components";
import { cn } from "@/lib/utils";

// Icons are picked by name from markdown; only these are bundled.
const ICONS = {
    "arrow-right": ArrowRight,
    "book-open": BookOpen,
    bot: Bot,
    "check-circle": CheckCircle,
    hammer: Hammer,
    "life-buoy": LifeBuoy,
    "map-pin": MapPin,
    network: Network,
    shapes: Shapes,
    sparkles: Sparkles,
    terminal: Terminal,
    waypoints: Waypoints,
    workflow: Workflow,
};

const props = defineProps<{
    title: string;
    /** Makes the whole tile a link: the slot must not contain links then. */
    to?: string;
    icon?: keyof typeof ICONS;
    class?: HTMLAttributes["class"];
}>();

const external = computed(() => !!props.to && !props.to.startsWith("/"));
</script>

<template>
    <component
        :is="props.to ? (external ? 'a' : NuxtLink) : 'div'"
        v-bind="props.to ? (external ? { href: props.to, target: '_blank', rel: 'noopener noreferrer' } : { to: props.to }) : {}"
        :class="cn(
            'k-tile not-prose group bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-5 transition-colors',
            props.to && 'hover:border-foreground/30 hover:bg-accent/50',
            props.class,
        )"
    >
        <div class="flex items-center gap-2.5">
            <span v-if="props.icon" class="bg-accent text-foreground grid size-8 shrink-0 place-items-center rounded-md">
                <component :is="ICONS[props.icon]" class="size-4" />
            </span>
            <span class="text-foreground font-heading text-lg font-bold">{{ props.title }}</span>
            <ArrowRight v-if="props.to" class="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div class="k-tile-body text-muted-foreground text-sm leading-relaxed">
            <slot mdc-unwrap="p" />
        </div>
    </component>
</template>

<style scoped>
.font-heading {
    font-family: Candara, Arial, Helvetica, sans-serif;
}

.k-tile, .k-tile:hover {
    text-decoration: none !important;
}

.k-tile-body :deep(ul) {
    margin: 0.25rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.k-tile-body :deep(p) {
    margin: 0;
}
</style>
