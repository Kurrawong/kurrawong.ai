// Shared state between the landing page hero and the KChat widget.

export const KCHAT_SUGGESTIONS = [
    "What products does KurrawongAI make?",
    "Who works at KurrawongAI?",
    "What services does KurrawongAI offer?",
    "Tell me about the Biodiversity Data Repository project",
    "How can I contact KurrawongAI?",
];

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
