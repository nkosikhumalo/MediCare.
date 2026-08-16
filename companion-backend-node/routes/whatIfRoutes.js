/**
 * What-If / Premium Simulation Routes
 *
 * Enforcement layer: ROLE_POLICYHOLDER only, deceased flag freezes access.
 * ROLE_BENEFICIARY → HTTP 403 short-circuited HERE, never proxied to Java.
 */

const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { proxyToJava } = require("../services/proxyService");

router.post(
    "/simulate",
    authenticate,
    requireRole.policyholder(),   // 403 for ROLE_BENEFICIARY + deceased freeze
    (req, res) => proxyToJava(req, res, "/api/what-if/simulate")
);

module.exports = router;
