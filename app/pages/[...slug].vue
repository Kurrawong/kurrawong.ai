<script lang="ts" setup>
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk && titleChunk !== 'KurrawongAI' ? `${titleChunk} | KurrawongAI` : 'KurrawongAI';
    }
});

const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection("content").path(route.path).first();
});

const { data: navigation } = await useAsyncData("navigation", () => queryCollectionNavigation("content"));
</script>

<template>
    <div class="flex flex-col min-h-dvh">
        <MainNav :navigation="navigation" />
        <main class="grow mb-12">
            <div class="mx-auto max-w-[1200px] px-5 prose dark:prose-invert">
                <Breadcrumbs :navigation="navigation" :page="page" />
                <ContentRenderer v-if="page" :value="page" />
                <div v-else>
                    <h1>Page not found</h1>
                    <p>Sorry, this page does not exist. <NuxtLink to="/">Go home</NuxtLink>.</p>
                </div>
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
</template>
