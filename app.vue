<script lang="ts" setup>
import { ConfigProvider } from "radix-vue";

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk && titleChunk !== 'KurrawongAI' ? `${titleChunk} | KurrawongAI` : 'KurrawongAI';
    }
});

const useIdFunction = () => useId();
</script>

<template>
    <NuxtRouteAnnouncer />
    <ConfigProvider :use-id="useIdFunction">
        <div class="flex flex-col min-h-dvh">
            <MainNav />
            <main class="grow mb-12">
                <div class="mx-auto max-w-[1200px] px-5 prose dark:prose-invert">
                    <Breadcrumbs />
                    <ContentDoc />
                </div>
            </main>
            <footer class="bg-secondary">
                <div class="mx-auto max-w-[1200px] py-12 px-5">
                    <div class="text-center"> ABN: <a href="https://abr.business.gov.au/ABN/View?abn=31353542036">31 353 542 036</a>
                        | Email: <a href="mailto:info@kurrawong.ai">info@kurrawong.ai</a> | Phone: <a href="tel:61 477 560 177">+61 477
                            560 177</a> | 72 Yundah St, Shorncliffe, QLD 4017 Australia
                            <div>&copy; KurrawongAI, 2024</div>
                    </div>
                </div>
            </footer>
        </div>
    </ConfigProvider>
</template>
