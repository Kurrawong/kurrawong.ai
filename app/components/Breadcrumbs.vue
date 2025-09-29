<script lang="ts" setup>
import type { ContentCollectionItem, ContentNavigationItem } from "@nuxt/content";
import { findPageBreadcrumb } from '@nuxt/content/utils'
import { Home } from "lucide-vue-next";

const route = useRoute();

const props = defineProps<{
    navigation?: ContentNavigationItem[];
    page?: ContentCollectionItem;
}>();

const breadcrumbs = findPageBreadcrumb(props.navigation, route.path)
</script>

<template>
    <Breadcrumb v-if="route.path !== '/'">
        <BreadcrumbList class="p-0 list-none">
            <BreadcrumbItem>
                <BreadcrumbLink as-child>
                    <NuxtLink to="/"><Home class="size-4" /></NuxtLink>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <template v-for="crumb in breadcrumbs">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                        <NuxtLink :to="crumb.path">{{ crumb.title }}</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </template>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>
                    {{ props.page.title }}
                </BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
</template>
