import { apiFetch } from "./api";

export async function ragChat(question, conversationId) {
    const data = await apiFetch("/api/rag/chat", {
        method: "POST",
        body: JSON.stringify({ question, conversationId }),
    });
    // Backend returns { answer, conversationId }
    return { ...data, reply: data.answer };
}
