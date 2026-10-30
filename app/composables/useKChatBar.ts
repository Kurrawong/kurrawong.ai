// Shared state between the landing page hero and the KChat widget.

/** Node types from the landing-page diagram; each suggestion is coloured by
 *  the type of thing it asks about, using the diagram's palette. */
export type KChatSuggestionType = "person" | "organization" | "product" | "service" | "project";

export const KCHAT_SUGGESTION_TYPES: Record<string, KChatSuggestionType> = {
    "What products does KurrawongAI make?": "product",
    "Who works at KurrawongAI?": "person",
    "What services does KurrawongAI offer?": "service",
    "Tell me about the Biodiversity Data Repository project": "project",
    "How can I contact KurrawongAI?": "organization",
    "Which organisations has KurrawongAI worked with on its projects?": "organization",
    "What is KurrawongAI a member of?": "organization",
    "What online tools does KurrawongAI provide?": "product",
    "What is Prez and who uses it?": "product",
    "What training does KurrawongAI offer?": "service",
    "Tell me about the Indigenous Data Network Catalogue project": "project",
    "Where is KurrawongAI based?": "organization",
    "What is Bower?": "product",
    "What is K-Maker used for?": "product",
    "What is Olis?": "product",
    "What does kurra do?": "product",
    "Who founded KurrawongAI?": "person",
    "What is the KG Validator?": "product",
    "What is VocExcel used for?": "product",
    "Tell me about the OGC RAINBOW platform project": "project",
    "What data governance services does KurrawongAI offer?": "service",
    "What is pyLODE?": "product",
    "Does KurrawongAI support RDFLib?": "product",
    "What is KurrawongAI's ABN?": "organization",
    "Who is the director of KurrawongAI?": "person",
    "What reference data services does KurrawongAI offer?": "service",
    "Tell me about the Queensland spatial datasets rebuild": "project",
    "What was the National Address Model project?": "project",
    "What does KurrawongAI's support service cover?": "service",
    "What vocabularies has KurrawongAI created for clients?": "service",
};

export const KCHAT_SUGGESTIONS = Object.keys(KCHAT_SUGGESTION_TYPES);

/** The contact question is always included in the suggestions and answered locally. */
export const KCHAT_CONTACT_QUESTION = "How can I contact KurrawongAI?";

/** Suggestions always included alongside the random picks: the core offering
 *  questions plus the contact question. */
export const KCHAT_PINNED_SUGGESTIONS = [
    "What products does KurrawongAI make?",
    "What services does KurrawongAI offer?",
    "What training does KurrawongAI offer?",
    KCHAT_CONTACT_QUESTION,
];

/** Pick `count` distinct suggestions at random, always including the pinned ones. Call client-side only. */
export function kchatRandomSuggestions(count = 13): string[] {
    const rest = KCHAT_SUGGESTIONS.filter(suggestion => !KCHAT_PINNED_SUGGESTIONS.includes(suggestion));
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const picked = [...rest.slice(0, Math.max(0, count - KCHAT_PINNED_SUGGESTIONS.length)), ...KCHAT_PINNED_SUGGESTIONS];
    for (let i = picked.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [picked[i], picked[j]] = [picked[j], picked[i]];
    }
    return picked;
}

/** Fewer suggestions on small screens. Call client-side only. */
export function kchatSuggestionCount(): number {
    return window.matchMedia("(max-width: 639px)").matches ? 5 : 13;
}

export function useKChatBar() {
    const pendingQuestion = useState<string | null>("kchat-pending-question", () => null);
    // True while a landing-page conversation is open, so the hero can keep its
    // fixed buttons clear of the chat column on small screens.
    const conversationActive = useState<boolean>("kchat-conversation-active", () => false);

    /** Queue a question for the KChat widget to submit. */
    function ask(question: string) {
        pendingQuestion.value = question;
    }

    return { ask, pendingQuestion, conversationActive };
}

export function useGraphExplore() {
    const exploring = useState<boolean>("kgraph-exploring", () => false);
    return { exploring };
}

/**
 * Landing-page chat layout variant. "fullscreen" fills the viewport under the
 * header with the chat and hides the graph diagram; "corner" is the original
 * top-left chat column over the graph. This branch shows off the fullscreen
 * variant; flip the default to compare the two.
 */
export function useKChatVariant() {
    const variant = useState<"corner" | "fullscreen">("kchat-variant", () => "fullscreen");
    const chatFullscreen = computed(() => variant.value === "fullscreen");
    return { variant, chatFullscreen };
}

/**
 * Shared scroll fade for the landing hero: 1 at the top of the page, fading to
 * 0 as the main content scrolls into view. KHero updates it; other landing
 * widgets (e.g. the chat column) react to it.
 */
export function useScrollFade() {
    const scrollFade = useState<number>("kgraph-scroll-fade", () => 1);
    return { scrollFade };
}
