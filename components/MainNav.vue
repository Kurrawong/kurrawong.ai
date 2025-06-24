<script setup lang="ts">
import { ChevronDown, ChevronUp, X, Search, Sun, Moon, SunMoon, Menu , ExternalLink} from "lucide-vue-next";

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

const searchTerm = ref("");
const showSearch = ref(false);
const showSidenav = ref(false);

const { data, status, error, refresh } = await useLazyAsyncData(() => searchContent(searchTerm));

const results = computed(() => {
    const searchResults = [];
    if (data.value?.value) {
        // data.value.value.forEach(r => {
        //     const existing = searchResults.find(s => s.id.split("#")[0] === r.id.split("#")[0]);
        //     if (existing) {
                
        //     } else {
        //         searchResults.push(r);
        //     }
        // });
        return data.value.value;
    }
    return searchResults;
});

function reset() {
    showSearch.value = false;
    searchTerm.value = "";
    data.value = [];
}

router.beforeEach((from, to) => {
    showSidenav.value = false;
    reset();
});

watch(showSearch, (newValue) => {
    if (!newValue) {
        reset();
    }
});
</script>
<template>
    <header class="top-nav sticky top-0 bg-background border-b-2 border-b-eye grid grid-cols-3 md:flex md:flex-row md:justify-between items-center px-2 z-50">
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
                            <NuxtImg v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/KurrawongAI_350.png" alt="KurrawongAI Logo" height="40px" />
                            <NuxtImg v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/kurrawong-dark-150.png" alt="KurrawongAI Logo" height="40px" />
                        </NuxtLink>
                    </div>
                    <div></div>
                </SheetHeader>
                <div class="nav-sidebar flex flex-col gap-2">
                    <ContentNavigation v-slot="{ navigation }">
                        <template v-for="link of navigation">
                            <Collapsible v-if="link.children && link.children.length > 1" :defaultOpen="route.path.startsWith(link._path)" v-slot="{open}">
                                <CollapsibleTrigger as-child>
                                    <Button :variant="route.path.startsWith(link._path) ? 'default' : 'ghost'" class="w-full">
                                        {{ link.children.find(c => c._path === link._path)?.title || link.title }}
                                        <ChevronUp v-if="open" class="size-4" />
                                        <ChevronDown v-else class="size-4" />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent class="flex flex-col gap-2 bg-secondary/50 rounded">
                                    <template v-if="link.children.find(c => c._path === link._path)">
                                        <Button :variant="route.path === link._path ? 'default' : 'ghost'" as-child>
                                            <NuxtLink :to="link._path" class="!font-bold">
                                                {{ link.children.find(c => c._path === link._path)?.title }} Home
                                            </NuxtLink>
                                        </Button>
                                        <Separator />
                                    </template>
                                    <Button v-for="child in link.children" :variant="route.path.startsWith(child._path) ? 'default' : 'ghost'" as-child>
                                        <NuxtLink v-if="child._path !== link._path" :to="child._path">{{ child.title }}</NuxtLink>
                                    </Button>
                                </CollapsibleContent>
                            </Collapsible>
                            <Button v-else :variant="route.path.startsWith(link._path) ? 'default' : 'ghost'" :class="route.path.startsWith(link._path) ? 'active' : ''" as-child>
                                <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
                            </Button>
                        </template>
                    </ContentNavigation>
                    <Button v-for="extLink in externalLinks" variant="ghost" as-child>
                        <a :href="extLink.url" target="_blank" rel="noopener noreferrer">{{ extLink.title }} <ExternalLink class="size-4" /></a>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        <div class="flex justify-center md:block">
            <NuxtLink to="/">
                <NuxtImg v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/KurrawongAI_350.png" alt="KurrawongAI Logo" height="54px" />
                <NuxtImg v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/kurrawong-dark-150.png" alt="KurrawongAI Logo" height="54px" />
            </NuxtLink>
        </div>
        <div class="ml-auto md:flex md:flex-row gap-2 hidden">
            <ContentNavigation v-slot="{ navigation }">
                <template v-for="link of navigation">
                    <DropdownMenu v-if="link.children && link.children.length > 1" v-slot="{open}">
                        <DropdownMenuTrigger as-child>
                            <Button :variant="route.path.startsWith(link._path) ? 'default' : 'ghost'">
                                {{ link.children.find(c => c._path === link._path)?.title || link.title }}
                                <ChevronUp v-if="open" class="size-4" />
                                <ChevronDown v-else class="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56 nav-dropdown">
                            <DropdownMenuItem v-if="link.children.find(c => c._path === link._path)" :class="route.path === link._path ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground' : ''" as-child>
                                <NuxtLink :to="link._path" class="font-bold cursor-pointer">
                                    {{ link.children.find(c => c._path === link._path)?.title }} Home
                                </NuxtLink>
                            </DropdownMenuItem>
                            <DropdownMenuLabel v-else as-child>{{ link.title }}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem v-for="child in link.children" :class="route.path.startsWith(child._path) ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground' : ''" as-child>
                                    <NuxtLink v-if="child._path !== link._path" :to="child._path" class="cursor-pointer">{{ child.title }}</NuxtLink>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button v-else :variant="route.path.startsWith(link._path) ? 'default' : 'ghost'" as-child>
                        <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
                    </Button>
                </template>
            </ContentNavigation>
            <Button v-for="extLink in externalLinks" variant="ghost" as-child>
                <a :href="extLink.url" target="_blank" rel="noopener noreferrer">{{ extLink.title }} <ExternalLink class="size-4" /></a>
            </Button>
        </div>
        <div class="flex flex-row justify-end items-center">
            <Dialog v-model:open="showSearch">
                <DialogTrigger as-child>
                    <Button variant="ghost" size="icon">
                        <Search class="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[640px] rounded-lg" hideClose>
                    <div class="relative w-full items-center">
                        <Input type="search" v-model="searchTerm" @input="refresh" placeholder="Search..." class="px-10" autofocus />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                            <Search class="size-5 text-muted-foreground" />
                        </span>
                        <span class="absolute end-0 inset-y-0 flex items-center justify-center">
                            <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="searchTerm = ''">
                                <X class="size-4" />
                            </Button>
                        </span>
                    </div>
                    <div v-if="results.length > 0" class="flex flex-col gap-4 max-h-[80dvh] overflow-y-auto">
                        <NuxtLink v-for="res in results" :to="res.id" class="search-result">
                            <Card class="hover:bg-accent cursor-pointer p-3 flex flex-col gap-2">
                                <CardHeader class="p-0">
                                    <template v-if="res.titles.length > 0">{{ res.titles[0] }} > {{ res.title }}</template>
                                    <template v-else>{{ res.title }}</template>
                                </CardHeader>
                                <CardContent class="p-0">
                                    <p class="text-sm italic text-muted-foreground">
                                        {{ res.content.length > 200 ? res.content.slice(0, 200) + "..." : res.content }}
                                    </p>
                                </CardContent>
                            </Card>
                        </NuxtLink>
                    </div>
                </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined">
                <SunMoon v-show="colorMode.unknown" />
                <Sun v-show="colorMode.value === 'dark'" class="w-4 h-4" />
                <Moon v-show="colorMode.value === 'light'" class="w-4 h-4" />
            </Button>
        </div>
    </header>
</template>
