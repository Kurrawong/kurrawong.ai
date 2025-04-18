<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(defineProps<{
    class?: HTMLAttributes["class"];
    imgPosition?: "top" | "right" | "bottom" | "left";
    imgHalf?: boolean;
}>(), {
    imgPosition: "right",
    imgHalf: false,
});
</script>

<template>
    <Card :class="cn(`${$slots.img ? `flex ${props.imgPosition === 'bottom' ? 'flex-col' : 'flex-col-reverse'} ${props.imgPosition === 'top' ? 'sm:flex-col-reverse' : (props.imgPosition === 'bottom' ? 'sm:flex-col' : (props.imgPosition === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'))}` : ''}`, props.class)">
        <div :class="props.imgHalf ? 'flex-1' : 'grow'">
            <CardHeader v-if="$slots.title || $slots.header" class="card-header">
                <slot name="header">
                    <CardTitle class="font-normal text-xl"><ContentSlot :use="$slots.title" unwrap="p" /></CardTitle>
                    <CardDescription><ContentSlot :use="$slots.description" unwrap="p" /></CardDescription>
                </slot>
            </CardHeader>
            <CardContent :class="`card-body ${$slots.title || $slots.header ? '' : 'pt-6'}`">
                <slot />
            </CardContent>
            <CardFooter v-if="$slots.footer">
                <ContentSlot :use="$slots.footer" unwrap="p" />
            </CardFooter>
        </div>
        <div v-if="$slots.img" :class="`flex shrink-0 justify-center items-center p-3 img ${props.imgHalf ? 'flex-1' : ''}`">
            <ContentSlot :use="$slots.img" unwrap="p" />
        </div>
    </Card>
</template>

<style scoped>
h3, :deep(h3) {
    margin: 0;
}

.card-header :deep(p) {
    margin: 0;
}
.card-body > :deep(p:first-child) {
    margin-top: 0;
}
.card-body > :deep(p:last-child) {
    margin-bottom: 0;
}
.img :deep(img) {
    margin: 0;
}
</style>