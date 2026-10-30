<script lang="ts" setup>
// A very faint line drawing of abstract gum trees pinned to the bottom of the
// viewport. Trees are generated from a fixed seed so the server and client
// render identical paths.

const WIDTH = 1600;
const HEIGHT = 400;
const GROUND = 392;

/** mulberry32: small seeded PRNG. */
function seeded(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const random = seeded(1788);
const between = (min: number, max: number) => min + random() * (max - min);
const n = (value: number) => value.toFixed(1);

// Paths grouped by stroke width: trunks heavier, leaves finest.
const strokes: Record<string, string[]> = { "1.4": [], "1": [], "0.7": [], "0.5": [] };

/** A curved limb from (x, y) at angle (radians from vertical), returning its end. */
function limb(x: number, y: number, angle: number, length: number, width: string) {
    const ex = x + Math.sin(angle) * length;
    const ey = y - Math.cos(angle) * length;
    // Gum limbs kink and wander: bend the curve sideways.
    const bend = between(-0.35, 0.35) * length;
    const cx = (x + ex) / 2 + Math.cos(angle) * bend;
    const cy = (y + ey) / 2 + Math.sin(angle) * bend;
    strokes[width]!.push(`M${n(x)} ${n(y)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}`);
    return { x: ex, y: ey };
}

/** A loose clump of drooping, sickle-shaped eucalypt leaves. */
function leaves(x: number, y: number, size: number) {
    const count = Math.round(between(3, 6));
    for (let i = 0; i < count; i++) {
        const sx = x + between(-size, size);
        const sy = y + between(-size * 0.6, size * 0.4);
        const side = random() < 0.5 ? -1 : 1;
        const length = between(size * 0.6, size * 1.1);
        const ex = sx + side * between(1, length * 0.4);
        const ey = sy + length;
        const cx = sx + side * length * 0.5;
        const cy = sy + length * 0.3;
        strokes["0.5"]!.push(`M${n(sx)} ${n(sy)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}`);
    }
}

function branch(x: number, y: number, angle: number, length: number, depth: number, leafSize: number) {
    const width = depth >= 3 ? "1" : "0.7";
    const end = limb(x, y, angle, length, width);
    if (depth === 0 || length < 10) {
        leaves(end.x, end.y, leafSize);
        return;
    }
    const children = random() < 0.15 ? 3 : 2;
    for (let i = 0; i < children; i++) {
        const spread = (i - (children - 1) / 2) * between(0.45, 0.8);
        branch(end.x, end.y, angle * 0.5 + spread + between(-0.15, 0.15), length * between(0.62, 0.8), depth - 1, leafSize);
    }
}

function gumTree(x: number, height: number) {
    // A tall, slightly leaning, sinuous trunk that forks into an open crown.
    const lean = between(-0.12, 0.12);
    let point = { x, y: GROUND };
    const segments = 3;
    for (let i = 0; i < segments; i++) {
        point = limb(point.x, point.y, lean + between(-0.08, 0.08), (height * 0.5) / segments, "1.4");
    }
    const depth = height > 250 ? 4 : height > 150 ? 3 : 2;
    const forks = random() < 0.6 ? 2 : 3;
    for (let i = 0; i < forks; i++) {
        const spread = (i - (forks - 1) / 2) * between(0.35, 0.6);
        branch(point.x, point.y, lean + spread, height * between(0.18, 0.3), depth, height / 26);
    }
}

// Scatter trees across the width: a few tall ones, saplings between.
let x = between(20, 80);
while (x < WIDTH) {
    const tall = random() < 0.55;
    gumTree(x, tall ? between(200, 300) : between(90, 170));
    x += between(110, 250);
}

// A gently rolling ground line with sparse grass tufts.
let ground = `M0 ${GROUND}`;
for (let gx = 80; gx <= WIDTH; gx += 80) {
    ground += `Q${gx - 40} ${n(GROUND + between(-4, 4))} ${gx} ${GROUND}`;
}
strokes["0.7"]!.push(ground);
for (let i = 0; i < 70; i++) {
    const gx = between(0, WIDTH);
    for (let blade = 0; blade < 3; blade++) {
        const h = between(4, 11);
        strokes["0.5"]!.push(`M${n(gx)} ${GROUND}Q${n(gx + (blade - 1) * 2)} ${n(GROUND - h / 2)} ${n(gx + (blade - 1) * between(2, 5))} ${n(GROUND - h)}`);
    }
}

const paths = Object.entries(strokes).map(([width, ds]) => ({ width, d: ds.join("") }));
</script>

<template>
    <svg
        aria-hidden="true"
        class="k-bush text-foreground pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[260px] w-full opacity-[0.14] sm:h-[440px] dark:opacity-[0.12]"
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
    >
        <path v-for="path in paths" :key="path.width" :d="path.d" :stroke-width="path.width" vector-effect="non-scaling-stroke" />
    </svg>
</template>

<style scoped>
/* Fade the treeline out towards the top so it reads as background. */
.k-bush {
    mask-image: linear-gradient(to top, black 35%, transparent);
}
</style>
