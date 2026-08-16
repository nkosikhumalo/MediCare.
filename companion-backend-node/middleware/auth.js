/**
 * JWT Authentication Middleware — Trust Zone 3 (Node.js BFF, Port 3001)
 *
 * Verifies the signed bearer token on every protected request.
 * Extracts role + deceasedFlag and attaches them to req.user so that
 * downstream role-guard middleware (requireRole.js) and controllers
 * can make trust decisions without re-parsing the token.
 *
 * Fail-closed: any missing, malformed, or expired token → 401.
 * We never fail open.
 */

const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {
    const header = req.headers["authorization"] || "";
    if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or malformed Authorization header" });
    }

    const token = header.slice(7);
    const secret = process.env.JWT_SECRET || process.env.MOCK_JWT_SIGNING_SECRET;

    try {
        const claims = jwt.verify(token, secret, { algorithms: ["HS256", "HS384", "HS512"] });

        // Normalize role: accept both "policy_holder" (DB value) and
        // "ROLE_POLICYHOLDER" / "POLICYHOLDER" (Java-style tokens).
        const rawRole = (claims.role || "").toLowerCase().replace(/^role_/, "");
        const normalizedRole =
            rawRole === "policy_holder" || rawRole === "policyholder"
                ? "ROLE_POLICYHOLDER"
                : rawRole === "beneficiary"
                    ? "ROLE_BENEFICIARY"
                    : `ROLE_${rawRole.toUpperCase()}`;

        req.user = {
            id: claims.id || claims.sub,
            email: claims.email,
            role: normalizedRole,
            policyId: claims.policyId || claims.policy_id || null,
            deceasedFlag: claims.deceasedFlag === true || claims.deceased_flag === true,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token", detail: err.message });
    }
};
