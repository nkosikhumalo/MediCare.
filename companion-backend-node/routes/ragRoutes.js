/**
 * RAG / Policy Q&A Routes
 *
 * Both ROLE_POLICYHOLDER and ROLE_BENEFICIARY may query.
 * Deceased flag does NOT block read-only Q&A — claims guidance is still
 * available in Claims Support mode.
 */

const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { proxyToJava } = require("../services/proxyService");

const allowBoth = requireRole.anyRole();

router.post("/query", authenticate, allowBoth, (req, res) =>
    proxyToJava(req, res, "/api/rag/query")
);

router.post("/chat", authenticate, allowBoth, (req, res) =>
    proxyToJava(req, res, "/api/rag/chat")
);

module.exports = router;
