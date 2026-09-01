const db = require("../database/db");

// Create new conversation
exports.createConversation = async (req, res) => {
    try {
        const { user_id, title } = req.body;
        const conversation = await db.createConversation({ user_id, title });
        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create conversation" });
    }
};

// Get user's conversations
exports.getConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await db.getConversations(userId);
        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed loading conversations" });
    }
};

// Get messages
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await db.getMessages(conversationId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed loading messages" });
    }
};

// Delete a conversation — only the owner (matched via JWT user id) may delete
exports.deleteConversation = async (req, res) => {
    try {
        const conversationId = parseInt(req.params.id, 10);
        if (!conversationId || isNaN(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation id" });
        }
        // req.user is set by the auth middleware from the JWT — never trust the client
        const requestingUserId = req.user?.id;
        if (!requestingUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const deleted = await db.deleteConversation(conversationId, requestingUserId);
        if (!deleted) {
            return res.status(404).json({ error: "Conversation not found or not yours" });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete conversation" });
    }
};
    try {
        const { conversation_id, sender, message } = req.body;
        const savedMessage = await db.saveMessage({ conversation_id, sender, message });
        res.json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed saving message" });
    }
};

// Save message
exports.saveMessage = async (req, res) => {
    try {
        const { conversation_id, sender, message } = req.body;
        const savedMessage = await db.saveMessage({ conversation_id, sender, message });
        res.json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed saving message" });
    }
};
