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

/** Pick `count` distinct suggestions at random. Call client-side only. */
export function kchatRandomSuggestions(count = 13): string[] {
    const pool = [...KCHAT_SUGGESTIONS];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
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
