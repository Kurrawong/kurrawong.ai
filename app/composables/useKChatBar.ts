// Shared state between the landing page hero and the KChat widget.

export const KCHAT_SUGGESTIONS = [
    "What products does KurrawongAI make?",
    "Who works at KurrawongAI?",
    "What services does KurrawongAI offer?",
    "Tell me about the Biodiversity Data Repository project",
    "How can I contact KurrawongAI?",
    "Which organisations has KurrawongAI worked with on its projects?",
    "What is KurrawongAI a member of?",
    "What online tools does KurrawongAI provide?",
    "What is Prez and who uses it?",
    "What training does KurrawongAI offer?",
    "Tell me about the Indigenous Data Network Catalogue project",
    "Where is KurrawongAI based?",
    "What is Bower?",
    "What is K-Maker used for?",
    "What is Olis?",
    "What does kurra do?",
    "Who founded KurrawongAI?",
    "What is the KG Validator?",
    "What is VocExcel used for?",
    "Tell me about the OGC RAINBOW platform project",
    "What data governance services does KurrawongAI offer?",
    "What is pyLODE?",
    "Does KurrawongAI support RDFLib?",
    "What is KurrawongAI's ABN?",
    "Who is the director of KurrawongAI?",
    "What reference data services does KurrawongAI offer?",
    "Tell me about the Queensland spatial datasets rebuild",
    "What was the National Address Model project?",
    "What does KurrawongAI's support service cover?",
    "What vocabularies has KurrawongAI created for clients?",
];

/** The contact question is always included in the suggestions and answered locally. */
export const KCHAT_CONTACT_QUESTION = "How can I contact KurrawongAI?";

/** Pick `count` distinct suggestions at random, always including the contact question. Call client-side only. */
export function kchatRandomSuggestions(count = 13): string[] {
    const rest = KCHAT_SUGGESTIONS.filter(suggestion => suggestion !== KCHAT_CONTACT_QUESTION);
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const picked = [...rest.slice(0, Math.max(0, count - 1)), KCHAT_CONTACT_QUESTION];
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
 * Shared scroll fade for the landing hero: 1 at the top of the page, fading to
 * 0 as the main content scrolls into view. KHero updates it; other landing
 * widgets (e.g. the chat column) react to it.
 */
export function useScrollFade() {
    const scrollFade = useState<number>("kgraph-scroll-fade", () => 1);
    return { scrollFade };
}
