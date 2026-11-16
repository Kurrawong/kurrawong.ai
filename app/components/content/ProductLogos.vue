<script setup lang="ts">
</script>
<template>
    <div class="product-logos not-prose">
        <NuxtLink to="/products/address-manager">
            <img src="/img/logo-address-manager.svg" alt="Address Manager">
        </NuxtLink>
        <NuxtLink to="/products/k-maker">
            <img src="/img/logo-k-maker.png" alt="K-Maker">
        </NuxtLink>
        <NuxtLink to="/products/prez">
            <img src="/img/logo-prez.png" alt="Prez">
        </NuxtLink>
        <NuxtLink to="/products/bower">
            <img src="/img/bower.svg" alt="Bower">
        </NuxtLink>
        <NuxtLink to="/products/olis">
            <img src="/img/logo-olis.png" alt="Olis">
        </NuxtLink>
        <NuxtLink class="kurra-logo" to="/products/kurra">
            <img src="/img/logo-kurra.svg" alt="kurra">
        </NuxtLink>
    </div>
</template>

<style scoped>
.product-logos {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    align-items: center;
    gap: clamp(0.375rem, 2vw, 1.5rem);
    width: min(54rem, 100%);
    margin: 0 0 1rem auto;
}

.product-logos img {
    width: 100%;
    height: min(6rem, 16vw);
    object-fit: contain;
    margin: 0;
}

.kurra-logo {
    overflow: hidden;
}

.kurra-logo img {
    /* Compensate for the empty space around the wordmark in the SVG. */
    transform: scale(1.7);
}

@media (min-width: 70rem) {
    .product-logos {
        float: right;
        margin-left: 1.5rem;
    }
}
</style>
