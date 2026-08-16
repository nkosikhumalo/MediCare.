/**
 * Role Guard Middleware — enforces the capability matrix at Trust Zone 3.
 *
 * Usage:
 *   router.post("/simulate", authenticate, requireRole("ROLE_POLICYHOLDER"), handler)
 *
 * The request is short-circuited HERE and never proxied to the Java
 * microservice, matching the architecture spec (blocked at Node.js BFF).
 *
 * Deceased-flag check:
 *   If req.user.deceasedFlag is true the session is in Claims-Only mode.
 *   Any write/mutation endpoint (address updates, what-if) is blocked even
 *   for a token that still carries ROLE_POLICYHOLDER, because a deceased
 *   policyholder's self-service rights are frozen.
 */

const MUTATIONS = [
    "ROLE_POLICYHOLDER_WHAT_IF",
    "ROLE_POLICYHOLDER_SELF_SERVICE",
];

/**
 * @param  {...string} allowedRoles  e.g. requireRole("ROLE_POLICYHOLDER")
 * @param  {boolean}   [blockDeceased=false]  pass true for mutation endpoints
 */
function requireRole(...allowedRoles) {
    const blockDeceased = allowedRoles.includes("__BLOCK_DECEASED__");
    const roles = allowedRoles.filter((r) => r !== "__BLOCK_DECEASED__");

    return function roleGuard(req, res, next) {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Deceased flag freezes self-service / mutation endpoints.
        if (blockDeceased && user.deceasedFlag) {
            return res.status(403).json({
                message:
                    "This account is in Claims Support mode. Self-service operations are suspended. " +
                    "Please contact us to proceed with a death claim.",
                code: "DECEASED_FLAG_FROZEN",
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${user.role}.`,
                code: "INSUFFICIENT_ROLE",
            });
        }

        next();
    };
}

/** Convenience — mutation guard: policyholder-only AND frozen for deceased. */
requireRole.policyholder = () => requireRole("ROLE_POLICYHOLDER", "__BLOCK_DECEASED__");

/** Convenience — read guard: both roles allowed, but deceased flag still OK. */
requireRole.anyRole = () => requireRole("ROLE_POLICYHOLDER", "ROLE_BENEFICIARY");

module.exports = requireRole;
