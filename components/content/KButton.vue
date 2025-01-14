<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const props = withDefaults(defineProps<{
    to?: string;
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
}>(), {
    variant: "default",
    size: "default",
});
</script>

<template>
    <Button :variant="props.variant" :size="props.size" :class="cn('k-btn', props.class)" :as-child="!!props.to">
        <template v-if="props.to">
            <NuxtLink v-if="props.to.startsWith('/')" :to="props.to">
                <ContentSlot :use="$slots.default" unwrap="p" />
            </NuxtLink>
            <a v-else :href="props.to" target="_blank" rel="noopener noreferrer">
                <ContentSlot :use="$slots.default" unwrap="p" />
            </a>
        </template>
        <ContentSlot v-else :use="$slots.default" unwrap="p" />
    </Button>
</template>
