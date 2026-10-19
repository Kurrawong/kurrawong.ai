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
                        fill: new Fill({ color: "var(--chart-1, #d97706)" }),
                        stroke: new Stroke({ color: "#ffffff", width: 2.5 }),
                    }),
                }),
            }),
        ],
        view: new View({ center: position, zoom: 16 }),
    });
});

onBeforeUnmount(() => {
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
