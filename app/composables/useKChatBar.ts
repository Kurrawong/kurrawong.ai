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
];

/** Pick `count` distinct suggestions at random. Call client-side only. */
export function kchatRandomSuggestions(count = 3): string[] {
    const pool = [...KCHAT_SUGGESTIONS];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

export function useKChatBar() {
    const pendingQuestion = useState<string | null>("kchat-pending-question", () => null);

    /** Queue a question for the KChat widget to submit. */
    function ask(question: string) {
        pendingQuestion.value = question;
    }

    return { ask, pendingQuestion };
}

export function useGraphExplore() {
    const exploring = useState<boolean>("kgraph-exploring", () => false);
    return { exploring };
}
