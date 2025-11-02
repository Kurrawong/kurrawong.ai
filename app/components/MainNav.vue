<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { ChevronDown, ChevronUp, Sun, Moon, SunMoon, Menu , ExternalLink} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const colorMode = useColorMode();

const externalLinks = [
    {
        title: "Tools",
        url: "https://tools.kurrawong.ai/"
    },
    {
        title: "Docs",
        url: "https://docs.kurrawong.ai/"
    },
];

const props = defineProps<{
    navigation?: ContentNavigationItem[];
}>();

const showSidenav = ref(false);

router.beforeEach((from, to) => {
    showSidenav.value = false;
});
</script>

<template>
    <header class="top-nav sticky top-0 bg-background border-b-2 border-b-tertiary grid grid-cols-3 md:flex md:flex-row md:justify-between items-center gap-2 px-2 z-50">
        <Sheet v-model:open="showSidenav">
            <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="md:hidden">
                    <Menu class="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" class="p-2" hideClose>
                <SheetHeader class="grid grid-cols-3 gap-2 mb-4">
                    <SheetClose as-child>
                        <Button variant="ghost" size="icon">
                            <Menu class="size-4" />
                        </Button>
                    </SheetClose>
                    <div class="flex justify-center">
                        <NuxtLink to="/">
                            <NuxtImg v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/KurrawongAI_350.png" alt="KurrawongAI Logo" class="h-[40px]" />
                            <NuxtImg v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/kurrawong-dark-150.png" alt="KurrawongAI Logo" class="h-[40px]" />
                        </NuxtLink>
                    </div>
                    <div></div>
                </SheetHeader>
                <div class="nav-sidebar flex flex-col gap-2">
                    <template v-for="link of props.navigation">
                        <Collapsible v-if="link.children && link.children.length > 1" :defaultOpen="route.path.startsWith(link.path)" v-slot="{open}">
                            <CollapsibleTrigger as-child>
                                <Button :variant="route.path.startsWith(link.path) ? 'default' : 'ghost'" class="w-full">
                                    {{ link.children.find(c => c.path === link.path)?.title || link.title }}
                                    <ChevronUp v-if="open" class="size-4" />
                                    <ChevronDown v-else class="size-4" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent class="flex flex-col gap-2 bg-secondary/50 rounded">
                                <template v-if="link.children.find(c => c.path === link.path)">
                                    <Button :variant="route.path === link.path ? 'default' : 'ghost'" as-child>
                                        <NuxtLink :to="link.path" class="!font-bold">
                                            {{ link.children.find(c => c.path === link.path)?.title }} Home
                                        </NuxtLink>
                                    </Button>
                                    <Separator />
                                </template>
                                <Button v-for="child in link.children" :variant="route.path.startsWith(child.path) ? 'default' : 'ghost'" as-child>
                                    <NuxtLink v-if="child.path !== link.path" :to="child.path">{{ child.title }}</NuxtLink>
                                </Button>
                            </CollapsibleContent>
                        </Collapsible>
                        <Button v-else :variant="route.path.startsWith(link.path) ? 'default' : 'ghost'" :class="route.path.startsWith(link.path) ? 'active' : ''" as-child>
                            <NuxtLink :to="link.path">{{ link.title }}</NuxtLink>
                        </Button>
                    </template>
                    <Button v-for="extLink in externalLinks" variant="ghost" as-child>
                        <a :href="extLink.url" target="_blank" rel="noopener noreferrer">{{ extLink.title }} <ExternalLink class="size-4" /></a>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        <div class="flex justify-center md:block">
            <NuxtLink to="/">
                <NuxtImg v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/KurrawongAI_350.png" alt="KurrawongAI Logo" class="h-[54px]" />
                <NuxtImg v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/kurrawong-dark-150.png" alt="KurrawongAI Logo" class="h-[54px]" />
            </NuxtLink>
        </div>
        <div class="ml-auto md:flex md:flex-row gap-2 hidden">
            <template v-for="link of props.navigation">
                <DropdownMenu v-if="link.children && link.children.length > 1" v-slot="{open}">
                    <DropdownMenuTrigger as-child>
                        <Button :variant="route.path.startsWith(link.path) ? 'default' : 'ghost'">
                            {{ link.children.find(c => c.path === link.path)?.title || link.title }}
                            <ChevronUp v-if="open" class="size-4" />
                            <ChevronDown v-else class="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56 nav-dropdown">
                        <DropdownMenuItem v-if="link.children.find(c => c.path === link.path)" :class="route.path === link.path ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground' : ''" as-child>
                            <NuxtLink :to="link.path" class="font-bold cursor-pointer">
                                {{ link.children.find(c => c.path === link.path)?.title }} Home
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuLabel v-else as-child>{{ link.title }}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem v-for="child in link.children" :class="route.path.startsWith(child.path) ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground' : ''" as-child>
                                <NuxtLink v-if="child.path !== link.path" :to="child.path" class="cursor-pointer">{{ child.title }}</NuxtLink>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button v-else :variant="route.path.startsWith(link.path) ? 'default' : 'ghost'" as-child>
                    <NuxtLink :to="link.path">{{ link.title }}</NuxtLink>
                </Button>
            </template>
            <Button v-for="extLink in externalLinks" variant="ghost" as-child>
                <a :href="extLink.url" target="_blank" rel="noopener noreferrer">{{ extLink.title }} <ExternalLink class="size-4" /></a>
            </Button>
        </div>
        <div class="flex flex-row justify-end items-center gap-2">
            <SearchCommand />
            <Button variant="ghost" size="icon" @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined">
                <SunMoon v-show="colorMode.unknown" />
                <Sun v-show="colorMode.value === 'dark'" class="w-4 h-4" />
                <Moon v-show="colorMode.value === 'light'" class="w-4 h-4" />
            </Button>
        </div>
    </header>
</template>
