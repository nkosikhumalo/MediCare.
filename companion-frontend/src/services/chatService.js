import { apiFetch } from "./api";

export async function createConversation(userId, title = "New Conversation") {
    return apiFetch("/api/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, title }),
    });
}

export async function getConversations(userId) {
    return apiFetch(`/api/chat/conversations/${userId}`);
}

export async function getMessages(conversationId) {
    return apiFetch(`/api/chat/messages/${conversationId}`);
}

export async function saveMessage(conversationId, sender, message) {
    return apiFetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ conversation_id: conversationId, sender, message }),
    });
}
