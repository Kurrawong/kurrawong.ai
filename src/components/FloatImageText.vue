<!-- This component is experimental. -->

<template>
  <p>
    <img
      v-bind:src="imageUrl"
      class="float-right"
      v-bind:alt="alt"
      v-bind:style="{ width: width + 'px' }"
    />
    <slot />
  </p>
</template>

<script setup lang="ts">
defineProps<{
  imageUrl?: string;
  floatImage?: string;
  width: string;
  alt?: string;
}>();
</script>
