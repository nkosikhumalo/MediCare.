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
