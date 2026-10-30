<script lang="ts" setup>
import type { ChatMessage } from "@/utils/kchat";
import { ChevronDown } from "lucide-vue-next";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const props = defineProps<{
    messages: ChatMessage[];
}>();

const emit = defineEmits<{
    "open-artifact": [name: string, version: number];
    send: [question: string];
}>();

const parsed = computed(() => props.messages.map(message => {
    if (message.kind === "contact" || message.role !== "assistant" || message.error) return { body: message.text, followUps: [] as string[] };
    return kchatExtractFollowUps(message.text);
}));
</script>

<template>
    <TransitionGroup name="kchat-bubble" tag="div" class="flex flex-col gap-3">
        <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
            <div
                class="max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm"
                :class="message.role === 'user' ? 'kchat-bubble-user text-foreground border' : 'bg-card text-foreground border'"
            >
                <KContactCard v-if="message.kind === 'contact'" />
                <div
                    v-else-if="parsed[index].body"
                    class="kchat-markdown"
                    :class="{ 'text-destructive': message.error }"
                    v-html="kchatMarkdown(parsed[index].body)"
                />
                <div v-if="parsed[index].followUps.length" class="mt-1.5 flex flex-wrap justify-start gap-1">
                    <button
                        v-for="followUp in parsed[index].followUps"
                        :key="followUp"
                        type="button"
                        class="kchat-follow-up rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] leading-4 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        @click="emit('send', followUp)"
                    >
                        {{ followUp }}
                    </button>
                </div>
                <Collapsible v-if="message.artifacts.length && !message.typing" v-slot="{ open }" class="mt-2.5">
                    <CollapsibleTrigger class="kchat-accent-hover text-muted-foreground hover:text-foreground hover:bg-accent/60 inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 text-xs transition-colors">
                        <ChevronDown class="size-3.5 transition-transform" :class="open ? 'rotate-180' : ''" />
                        SPARQL queries &amp; results
                        <span class="kchat-badge rounded px-1 text-[10px] font-medium">{{ message.artifacts.length }}</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div class="mt-1.5 flex flex-wrap gap-1.5">
                            <button
                                v-for="artifact in message.artifacts"
                                :key="`${artifact.name}:${artifact.version}`"
                                type="button"
                                class="kchat-accent-hover bg-background/60 hover:bg-accent inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-0.5 text-xs transition-colors"
                                :title="`Open ${artifact.name}`"
                                @click="emit('open-artifact', artifact.name, artifact.version)"
                            >
                                {{ artifact.label }}
                                <span class="text-muted-foreground text-[10px]">v{{ artifact.version }}</span>
                            </button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <span v-if="message.typing" class="mt-1 inline-flex gap-1">
                    <span class="size-1.5 animate-bounce rounded-full bg-(--kgraph-organization) [animation-delay:-0.3s]" />
                    <span class="size-1.5 animate-bounce rounded-full bg-(--kgraph-person) [animation-delay:-0.15s]" />
                    <span class="size-1.5 animate-bounce rounded-full bg-(--kgraph-service)" />
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
    color: var(--kchat-ink);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklch, var(--kchat-accent) 70%, transparent);
    text-underline-offset: 2px;
}

.kchat-markdown :deep(a:hover) {
    text-decoration-color: currentColor;
}

/* Palette highlights rather than blocks of colour: the user's bubble gets a
   faint accent tint and border; text keeps the foreground colour. */
.kchat-bubble-user {
    background: color-mix(in srgb, var(--kchat-accent) 12%, var(--background));
    border-color: color-mix(in oklch, var(--kchat-accent) 55%, transparent);
}

.kchat-follow-up {
    border-color: color-mix(in oklch, var(--kchat-accent) 45%, transparent);
}

.kchat-follow-up:hover,
.kchat-accent-hover:hover {
    border-color: var(--kchat-accent);
}

.kchat-follow-up:focus-visible {
    outline: 2px solid var(--kchat-focus);
    outline-offset: 2px;
}

.kchat-badge {
    background: color-mix(in oklch, var(--kchat-accent) 20%, transparent);
    color: var(--kchat-ink);
}
</style>
