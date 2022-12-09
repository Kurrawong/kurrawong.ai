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

<script lang="ts">
export default {
  name: "FloatImageText",
  props: {
    imageUrl: String,
    floatImage: String,
    width: String,
    alt: String,
  },
};
</script>
