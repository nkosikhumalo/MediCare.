const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const chatController = require("../controllers/chatController");

// ── All chat routes require a valid JWT ──────────────────────────────────────

// Conversations — both roles may read/create their own conversations.
router.post(
    "/conversations",
    authenticate,
    requireRole.anyRole(),
    chatController.createConversation
);

router.get(
    "/conversations/:userId",
    authenticate,
    requireRole.anyRole(),
    chatController.getConversations
);

// Messages — both roles may read/save messages (RAG Q&A is open to both).
router.get(
    "/messages/:conversationId",
    authenticate,
    requireRole.anyRole(),
    chatController.getMessages
);

router.post(
    "/messages",
    authenticate,
    requireRole.anyRole(),
    chatController.saveMessage
);

// Delete conversation — JWT ownership check inside controller, no raw SQL from client
router.delete(
    "/conversations/:id",
    authenticate,
    requireRole.anyRole(),
    chatController.deleteConversation
);

module.exports = router;
