package com.candor.companion.security;

import com.candor.companion.domain.CompanionRole;

/**
 * The authenticated identity for a request, AFTER server-side re-derivation.
 * <p>
 * {@code requestedRole} is what the JWT's {@code role} claim asserted at
 * issuance time. {@code effectiveRole} is what the backend actually
 * authorizes this request as, based on the live deceased-flag lookup. They
 * are kept separate on purpose so the promotion logic (and any mismatch) is
 * visible in logs/audit rather than silently overwritten.
 */
public record CompanionPrincipal(
        String subject,
        String policyId,
        CompanionRole requestedRole,
        CompanionRole effectiveRole,
        boolean deceasedFlag
) {
}
