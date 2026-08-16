/**
 * Claims Routes
 *
 * Both ROLE_POLICYHOLDER and ROLE_BENEFICIARY may submit and track claims.
 * Document upload proxies to Java for AI scanning, then result is persisted
 * to PostgreSQL by the controller before responding to the client.
 */

const express = require("express");
const multer = require("multer");
const router = express.Router();
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const claimsController = require("../controllers/claimsController");

// Store uploaded files in memory so we can forward the buffer to Java
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        cb(null, allowed.includes(file.mimetype));
    },
});

const allowBoth = requireRole.anyRole(); // POLICYHOLDER + BENEFICIARY

// Document checklist — no file, just JSON
router.get("/checklist", authenticate, allowBoth, claimsController.getChecklist);

// Create FNOL claim ticket
router.post("/", authenticate, allowBoth, claimsController.createClaim);

// Get claim status + documents
router.get("/:claimId", authenticate, allowBoth, claimsController.getClaim);

// Upload + AI-validate a document against a claim
router.post(
    "/:claimId/documents",
    authenticate,
    allowBoth,
    upload.single("document"),
    claimsController.uploadDocument
);

module.exports = router;
