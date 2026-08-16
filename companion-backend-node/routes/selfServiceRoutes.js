/**
 * Self-Service Routes (address updates, contact info)
 *
 * Enforcement layer: ROLE_POLICYHOLDER only, deceased flag freezes access.
 * ROLE_BENEFICIARY → HTTP 403 short-circuited HERE, never proxied to Java.
 */

const express = require("express");
const multer = require("multer");
const router = express.Router();
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { proxyMultipartToJava } = require("../services/proxyService");
const { proxyToJava } = require("../services/proxyService");

// Multer: accept optional document file + form fields
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

// Address update — parses multipart form, proxies to Java
router.post(
    "/address",
    authenticate,
    requireRole.policyholder(),
    upload.single("document"),
    (req, res) => {
        if (req.file) {
            // Has a document — use multipart proxy (province change + PoR verify)
            proxyMultipartToJava(req, res, "/api/self-service/address", (javaResponse) => {
                res.status(javaResponse.status === "APPROVED" ? 200 : javaResponse.status === "DOCUMENT_REQUIRED" ? 400 : 422).json(javaResponse);
            });
        } else {
            // No document — use multipart proxy without file (Java accepts multipart always)
            proxyMultipartToJava(req, res, "/api/self-service/address", (javaResponse) => {
                const httpStatus = javaResponse.status === "APPROVED" ? 200
                    : javaResponse.status === "VALIDATION_ERROR" ? 400 : 422;
                res.status(httpStatus).json(javaResponse);
            });
        }
    }
);

router.get(
    "/address",
    authenticate,
    requireRole.policyholder(),
    (req, res) => proxyToJava(req, res, "/api/self-service/address")
);

module.exports = router;
