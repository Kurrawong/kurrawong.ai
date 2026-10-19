<script lang="ts" setup>
import type { ChatMessage } from "@/utils/kchat";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const props = defineProps<{
    messages: ChatMessage[];
    // Show suggested-question pills when the conversation is empty.
    showSuggestions?: boolean;
}>();

const emit = defineEmits<{
    "open-artifact": [name: string, version: number];
    send: [question: string];
}>();

const suggestions = ref<string[]>([]);

onMounted(() => {
    // Random picks are made client-side so server and client markup match.
    suggestions.value = kchatRandomSuggestions(3);
});

const parsed = computed(() => props.messages.map(message => {
    if (message.role !== "assistant" || message.error) return { body: message.text, followUps: [] as string[] };
    return kchatExtractFollowUps(message.text);
}));
</script>

<template>
    <TransitionGroup name="kchat-bubble" tag="div" class="flex flex-col gap-3">
        <div v-if="showSuggestions && !messages.length" key="empty" class="flex flex-col items-center gap-3">
            <p class="text-muted-foreground mt-4 text-center text-sm">
                Ask a question about KurrawongAI, our people, products, services or projects.
            </p>
            <div v-if="suggestions.length" class="flex flex-wrap justify-center gap-2">
                <button
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    type="button"
                    class="bg-background hover:bg-accent rounded-full border px-3 py-1.5 text-xs"
                    @click="emit('send', suggestion)"
                >
                    {{ suggestion }}
                </button>
            </div>
        </div>

        <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
            <div
                class="max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm"
                :class="message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border'"
            >
                <div
                    v-if="parsed[index].body"
                    class="kchat-markdown"
                    :class="{ 'text-destructive': message.error }"
                    v-html="kchatMarkdown(parsed[index].body)"
                />
                <div v-if="parsed[index].followUps.length" class="mt-2 flex flex-wrap gap-1.5">
                    <button
                        v-for="followUp in parsed[index].followUps"
                        :key="followUp"
                        type="button"
                        class="bg-background hover:bg-accent rounded-full border px-2.5 py-1 text-xs"
                        @click="emit('send', followUp)"
                    >
                        {{ followUp }}
                    </button>
                </div>
                <Collapsible v-if="message.artifacts.length" class="mt-2">
                    <CollapsibleTrigger class="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline">
                        SPARQL queries &amp; results ({{ message.artifacts.length }})
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div class="mt-1.5 flex flex-wrap gap-1.5">
                            <button
                                v-for="artifact in message.artifacts"
                                :key="`${artifact.name}:${artifact.version}`"
                                type="button"
                                class="bg-background hover:bg-accent rounded-full border px-2.5 py-0.5 text-xs"
                                :title="`Open ${artifact.name}`"
                                @click="emit('open-artifact', artifact.name, artifact.version)"
                            >
                                {{ artifact.label }} · v{{ artifact.version }}
                            </button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <span v-if="message.typing" class="mt-1 inline-flex gap-1">
                    <span class="bg-muted-foreground size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
                    <span class="bg-muted-foreground size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
                    <span class="bg-muted-foreground size-1.5 animate-bounce rounded-full" />
                </span>
            </div>
        </div>
    </TransitionGroup>
</template>

<style scoped>
.kchat-bubble-enter-active {
    transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.kchat-bubble-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.kchat-bubble-move {
    transition: transform 0.25s ease;
}

.kchat-bubble-leave-active {
    display: none;
}

.kchat-markdown :deep(p) {
    margin: 0 0 0.5rem;
}

.kchat-markdown :deep(p:last-child) {
    margin-bottom: 0;
}

.kchat-markdown :deep(h1),
.kchat-markdown :deep(h2),
.kchat-markdown :deep(h3) {
    font-weight: 600;
    margin: 0.5rem 0;
}

.kchat-markdown :deep(ul),
.kchat-markdown :deep(ol) {
    margin: 0 0 0.5rem;
    padding-left: 1.25rem;
    list-style: revert;
}

.kchat-markdown :deep(pre) {
    background: color-mix(in srgb, currentColor 8%, transparent);
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    font-size: 0.75rem;
}

.kchat-markdown :deep(a) {
    text-decoration: underline;
    text-underline-offset: 2;
}
</style>
