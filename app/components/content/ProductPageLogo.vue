<script setup lang="ts">
defineProps<{
    src: string;
    alt: string;
}>();
</script>

<template>
    <div class="product-page-logo not-prose">
        <img :src="src" :alt="alt">
    </div>
</template>

<style scoped>
.product-page-logo {
    float: right;
    /* Twice the 7.75rem by 6rem desktop slot on the Products index. */
    width: min(15.5rem, 35%);
    margin: 0 0 1rem 1.5rem;
}

.product-page-logo img {
    display: block;
    width: 100%;
    aspect-ratio: 31 / 24;
    object-fit: contain;
}

.kurra-logo {
    overflow: hidden;
}

.kurra-logo img {
    /* Match the wordmark scaling on the Products index. */
    transform: scale(1.7);
}
</style>
