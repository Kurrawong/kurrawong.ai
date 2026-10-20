<script lang="ts" setup>
// OpenLayers is a large dependency: only load it when the map is shown.
const KContactMap = defineAsyncComponent(() => import("./KContactMap.vue"));

const details = [
    { label: "Address", value: "72 Yundah St, Shorncliffe QLD 4017, Australia" },
    { label: "Email", value: "info@kurrawong.ai", href: "mailto:info@kurrawong.ai" },
    { label: "Phone", value: "+61 477 560 177", href: "tel:+61477560177" },
    { label: "ABN", value: "31 353 542 036" },
];
</script>

<template>
    <div class="flex flex-col gap-3">
        <p class="!my-0 text-sm">You can get in touch with KurrawongAI at:</p>
        <ul class="mt-0 flex flex-col gap-1 !my-0 list-none pl-0">
            <li v-for="item in details" :key="item.label" class="flex gap-2 text-sm">
                <span class="text-muted-foreground w-16 shrink-0">{{ item.label }}</span>
                <a v-if="item.href" :href="item.href" class="underline underline-offset-2">{{ item.value }}</a>
                <span v-else>{{ item.value }}</span>
            </li>
        </ul>
        <ClientOnly>
            <KContactMap />
            <template #fallback>
                <div class="bg-muted h-44 w-full rounded-md border" />
            </template>
        </ClientOnly>
        <p class="text-muted-foreground !my-0 text-xs">
            See the <NuxtLink to="/about-us/get-in-touch" class="underline underline-offset-2">get in touch</NuxtLink> page for more ways to contact us. Map data ©
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="underline underline-offset-2">OpenStreetMap</a> contributors.
        </p>
    </div>
</template>
