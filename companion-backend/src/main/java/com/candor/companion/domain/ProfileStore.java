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
        profilesByPolicyId.put("POL-1001",
                new PolicyProfile("POL-1001", "sipho-policyholder-1001", "lerato-beneficiary-1001", false));

        // ── POL-2002 : Active Beneficiary on a live policy ─────────────────────
        profilesByPolicyId.put("POL-2002",
                new PolicyProfile("POL-2002", "sipho-policyholder-2002", "lerato-beneficiary-2002", false));

        // ── POL-3003 : Deceased policyholder — Empathetic Claims Mode ──────────
        profilesByPolicyId.put("POL-3003",
                new PolicyProfile("POL-3003", "sipho-policyholder-3003", "thandi-beneficiary-3003", true));

        // ── Test users seeded in Supabase ──────────────────────────────────────
        profilesByPolicyId.put("POL-NTANDO-001",
                new PolicyProfile("POL-NTANDO-001", "user-policyholder-19", "ntando.sibiya.ben@candor.local", false));

        profilesByPolicyId.put("POL-YOLANDA-001",
                new PolicyProfile("POL-YOLANDA-001", "user-policyholder-21", "yolanda.mthembu.ben@candor.local", false));

        profilesByPolicyId.put("POL-BOPHELO-001",
                new PolicyProfile("POL-BOPHELO-001", "user-policyholder-23", "bophelo.makuzeni.ben@candor.local", false));

        profilesByPolicyId.put("POL-LIKHONA-001",
                new PolicyProfile("POL-LIKHONA-001", "user-policyholder-25", "likhona.tshemese.ben@candor.local", false));

        profilesByPolicyId.put("POL-NKOSIMPHILE-001",
                new PolicyProfile("POL-NKOSIMPHILE-001", "user-policyholder-27", "nkosimphile.khumalo.ben@candor.local", false));

        profilesByPolicyId.put("POL-KAGISO-001",
                new PolicyProfile("POL-KAGISO-001", "user-policyholder-29", "kagiso.ntsoane.ben@candor.local", false));
    }

    public Optional<PolicyProfile> findByPolicyId(String policyId) {
        return Optional.ofNullable(profilesByPolicyId.get(policyId));
    }
}
