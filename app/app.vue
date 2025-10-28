<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
    <NuxtRouteAnnouncer />
    <ConfigProvider :use-id="useIdFunction">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ConfigProvider>
</template>
