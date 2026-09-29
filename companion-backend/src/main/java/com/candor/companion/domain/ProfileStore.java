package com.candor.companion.domain;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

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

    private static final Pattern BFF_SUBJECT = Pattern.compile("^user-(policyholder|beneficiary)-([1-9][0-9]*)$");

    private final Map<String, PolicyProfile> profilesByPolicyId = new ConcurrentHashMap<>();

    public ProfileStore() {
        // ── POL-1001 : Active Policyholder ─────────────────────────────────────
        profilesByPolicyId.put("POL-1001",
                new PolicyProfile("POL-1001", "sipho-policyholder-1001", "lerato-beneficiary-1001", false));

        // ── POL-2002 : Deceased policyholder (test case for demotion) ──────────
        profilesByPolicyId.put("POL-2002",
                new PolicyProfile("POL-2002", "user-policyholder-2", "user-beneficiary-2", true));

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

    /**
     * Resolve a profile for a verified host/BFF identity token. The host is
     * the identity authority for registered accounts and signs the deceased
     * flag from its user record. Local demo profiles remain authoritative.
     *
     * Accounts without an attached policy can still use general AI chat;
     * those accounts get an isolated synthetic scope, not a catalogue link.
     * The signed subject must be numeric and its role must match the token.
     */
    public Optional<PolicyProfile> resolveVerifiedAccount(
            String policyId, String subject, String requestedRole, boolean deceased) {
        PolicyProfile knownProfile = policyId == null ? null : profilesByPolicyId.get(policyId);
        if (knownProfile != null) {
            return Optional.of(knownProfile);
        }

        if (subject == null || requestedRole == null) {
            return Optional.empty();
        }

        Matcher matcher = BFF_SUBJECT.matcher(subject);
        if (!matcher.matches() || !matcher.group(1).equalsIgnoreCase(requestedRole)) {
            return Optional.empty();
        }

        if (policyId != null && (policyId.isBlank() || policyId.length() > 100)) {
            return Optional.empty();
        }

        String resolvedPolicyId = policyId == null ? "ACCOUNT-" + matcher.group(2) : policyId;
        return Optional.of(new PolicyProfile(resolvedPolicyId, subject, null, deceased));
    }
}
