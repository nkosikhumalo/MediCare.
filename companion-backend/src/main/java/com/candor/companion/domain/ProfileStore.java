package com.candor.companion.domain;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Mock, in-memory "source of truth" for policy/deceased state.
 * <p>
 * Design note: the deceased flag is deliberately NOT trusted from the
 * incoming JWT. A client could set any claim value it likes in a real
 * attack scenario, so authorization must be re-derived from a value the
 * server controls. This store is that value for the challenge; in the
 * finals it is replaced by a Postgres repository, with the same call
 * signature, so the security model does not change shape.
 */
@Component
public class ProfileStore {

    private final Map<String, PolicyProfile> profilesByPolicyId = new ConcurrentHashMap<>();

    public ProfileStore() {
        // ── POL-1001 : Active Policyholder ─────────────────────────────────────
        // Sipho Dlamini — full POLICYHOLDER access.
        // Can ask about cover, premiums, what-if scenarios, and self-service.
        profilesByPolicyId.put("POL-1001",
                new PolicyProfile("POL-1001", "sipho-policyholder-1001", "lerato-beneficiary-1001", false));

        // ── POL-2002 : Active Beneficiary on a live policy ─────────────────────
        // Lerato Mokoena — BENEFICIARY on a live policy.
        // Can ask Q&A and claims questions; blocked from what-if and self-service.
        profilesByPolicyId.put("POL-2002",
                new PolicyProfile("POL-2002", "sipho-policyholder-2002", "lerato-beneficiary-2002", false));

        // ── POL-3003 : Deceased policyholder — Empathetic Claims Mode ──────────
        // Thandi Nkosi — beneficiary where the policyholder has died.
        // Java filter demotes any POLICYHOLDER claim to BENEFICIARY server-side.
        // GroundedChatService activates Empathetic Claims Mode (deceasedFlag=true),
        // restricts RAG to DEATH_CLAIMS chunks, uses the empathetic system prompt.
        profilesByPolicyId.put("POL-3003",
                new PolicyProfile("POL-3003", "sipho-policyholder-3003", "thandi-beneficiary-3003", true));
    }

    public Optional<PolicyProfile> findByPolicyId(String policyId) {
        return Optional.ofNullable(profilesByPolicyId.get(policyId));
    }
}
