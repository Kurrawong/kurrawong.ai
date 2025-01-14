<script lang="ts" setup>
import { Home } from "lucide-vue-next";

const route = useRoute();

const breadcrumbs = ref(await getBreadcrumbs(route.path));

async function getBreadcrumbs(path: string) {
    let accPath = "";
    return await Promise.all(path.split("/").filter(p => p !== "").map(async (p) => {
        accPath += `/${p}`;
        return await queryContent(accPath).only(["title", "_path"]).findOne();
    }));
}

watch(() => route.path, async (newValue) => {
    breadcrumbs.value = await getBreadcrumbs(newValue);
});
</script>

<template>
    <Breadcrumb v-if="route.path !== '/'">
        <BreadcrumbList class="p-0 list-none">
            <BreadcrumbItem>
                <BreadcrumbLink as-child>
                    <NuxtLink to="/"><Home class="size-4" /></NuxtLink>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <!-- <BreadcrumbSeparator />
            <BreadcrumbItem>
                <DropdownMenu>
                    <DropdownMenuTrigger class="flex items-center gap-1">
                        <BreadcrumbEllipsis class="h-4 w-4" />
                        <span class="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>Documentation</DropdownMenuItem>
                        <DropdownMenuItem>Themes</DropdownMenuItem>
                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </BreadcrumbItem> -->
            <template v-for="crumb, index in breadcrumbs">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink v-if="index < breadcrumbs.length - 1" as-child>
                        <NuxtLink :to="crumb._path">{{ crumb.title }}</NuxtLink>
                    </BreadcrumbLink>
                    <BreadcrumbPage v-else>{{ crumb.title }}</BreadcrumbPage>
                </BreadcrumbItem>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
