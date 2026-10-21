<script lang="ts" setup>
import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Vector as VectorSource, OSM } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";

// 72 Yundah St, Shorncliffe QLD 4017, Australia.
const LON_LAT: [number, number] = [153.0831598, -27.325541];

const target = ref<HTMLElement | null>(null);
let map: Map | null = null;
let resizeObserver: ResizeObserver | null = null;

/**
 * Resolve a CSS color variable to a concrete color. OpenLayers parses colors
 * itself and rejects `var(...)` and `oklch(...)` values, which aborts the
 * map's render; the canvas 2D context normalises any CSS color to rgb.
 */
function themeColor(name: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!value) return fallback;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    return ctx.fillStyle === "#000000" ? fallback : ctx.fillStyle;
}

onMounted(() => {
    if (!target.value) return;
    const position = fromLonLat(LON_LAT);
    const marker = new Feature({ geometry: new Point(position) });
    map = new Map({
        target: target.value,
        layers: [
            new TileLayer({ source: new OSM() }),
            new VectorLayer({
                source: new VectorSource({ features: [marker] }),
                style: new Style({
                    image: new CircleStyle({
                        radius: 8,
                        fill: new Fill({ color: themeColor("--chart-1", "#d97706") }),
                        stroke: new Stroke({ color: "#ffffff", width: 2.5 }),
                    }),
                }),
            }),
        ],
        view: new View({ center: position, zoom: 16 }),
    });
    // The card mounts inside an animating chat bubble, so its size can still
    // be settling when OpenLayers reads it; re-sync the canvas whenever the
    // container's size changes so the map renders without manual zooming.
    resizeObserver = new ResizeObserver(() => map?.updateSize());
    resizeObserver.observe(target.value);
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    map?.dispose();
    map = null;
});
</script>

<template>
    <div ref="target" class="kcontact-map h-44 w-full overflow-hidden rounded-md border" aria-label="Map showing KurrawongAI's address" />
</template>

<style scoped>
.kcontact-map :deep(.ol-attribution) {
    font-size: 10px;
}

.kcontact-map :deep(.ol-control) {
    display: none;
}
</style>
