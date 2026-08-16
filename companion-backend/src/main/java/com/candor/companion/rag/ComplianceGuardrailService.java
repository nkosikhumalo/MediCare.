package com.candor.companion.rag;

import com.candor.companion.domain.AuditLoggerService;
import com.candor.companion.domain.AuditLoggerService.AuditAction;
import com.candor.companion.domain.AuditLoggerService.AuditStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * ComplianceGuardrailService — Java-layer circuit breaker.
 *
 * Acts as a post-processing safety net AFTER the LLM has responded.
 * Even with a deterministic (temperature=0.0) compliance prompt, this
 * service provides a hard backstop against any residual guarantee language
 * that slips through.
 *
 * The 3-tier taxonomy check is additive: it flags when a monetary figure
 * appears in a response that lacks the required Tier framing language,
 * substituting a safe redirect rather than passing a non-compliant answer
 * to the client.
 *
 * Audit: every triggered guardrail is emitted to AuditLoggerService so
 * compliance teams have a structured, queryable record of every LLM
 * response that required intervention.
 */
@Service
public class ComplianceGuardrailService {

    private static final Logger log = LoggerFactory.getLogger(ComplianceGuardrailService.class);

    private final AuditLoggerService auditLogger;

    public ComplianceGuardrailService(AuditLoggerService auditLogger) {
        this.auditLogger = auditLogger;
    }

    // -------------------------------------------------------------------------
    // Prohibited patterns — guarantee / certainty language
    // -------------------------------------------------------------------------
    private static final List<Pattern> PROHIBITED_PATTERNS = List.of(
            // Hard payout guarantees
            Pattern.compile("(?i)\\bguaranteed?\\s+(to\\s+)?(pay|receive|be\\s+paid|payout)\\b"),
            Pattern.compile("(?i)\\byou\\s+will\\s+(definitely|certainly|absolutely)\\s+(receive|get|be\\s+paid)\\b"),
            Pattern.compile("(?i)\\bclaim\\s+(is|will\\s+be)\\s+(approved|guaranteed)\\b"),
            // Exact payment date commitments
            Pattern.compile("(?i)\\bpayment\\s+will\\s+be\\s+made\\s+on\\b"),
            Pattern.compile("(?i)\\bpaid\\s+on\\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\\b"),
            // SLA conflated with approval guarantee
            Pattern.compile("(?i)\\bSLA\\s+(guarantees?|ensures?|confirms?)\\s+(approval|payment)\\b"),
            // Instant cash confirmation before assessment
            Pattern.compile("(?i)\\binstant\\s+cash\\s+(is|will\\s+be)\\s+(paid|confirmed|approved)\\b")
    );

    // -------------------------------------------------------------------------
    // Monetary figure detection — triggers taxonomy framing check
    // -------------------------------------------------------------------------
    private static final Pattern MONETARY_PATTERN =
            Pattern.compile("(?i)(R\\s?\\d[\\d,.]*)|(\\d[\\d,.]*\\s?(rand|ZAR))");

    // Required framing terms — at least one must be present when money is mentioned.
    // Includes documented contractual fee/premium language from the technical guide.
    private static final List<String> TIER_FRAMING_TERMS = List.of(
            "documented sum assured",
            "recorded benefit",
            "illustrative value",
            "model estimate",
            "may be payable",
            "potentially payable",
            "subject to",
            "final payable",
            "after.*assessment",
            "confirmed only after",
            "following.*validation",
            "as documented",
            "as stated",
            "according to the",
            "technical guide",
            "policy fee",
            "contract policy fee",
            "minimum contract premium",
            "minimum premium",
            "contractual premium",
            "documented in"
    );

    private static final String COMPLIANCE_REDIRECT =
            "I cannot confirm specific financial outcomes from the available information. "
            + "Policy values shown are recorded or illustrative amounts only (Tier 1). "
            + "Any payable amount is subject to full policy assessment, eligibility verification, "
            + "and formal claims processing before a confirmed outcome (Tier 3) can be established. "
            + "Please contact a consultant for authoritative guidance on your specific policy.";

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Validates an LLM-generated response against compliance rules.
     * Returns the original response if clean, or a safe redirect if any
     * guardrail fires. Emits a structured audit event for every intervention.
     *
     * @param response  Raw LLM response text.
     * @param userId    Authenticated subject (for audit trail).
     * @param policyId  Policy in scope (for audit trail).
     * @param role      Effective role (for audit trail).
     * @return Compliant response string — never null.
     */
    public String enforce(String response, String userId, String policyId, String role) {
        if (response == null || response.isBlank()) {
            auditLogger.log(userId, policyId, role,
                    AuditAction.COMPLIANCE_GUARDRAIL_FIRED,
                    Map.of("reason", "blank_or_null_response"),
                    true, AuditStatus.HOLD_FOR_MANUAL_REVIEW);
            return COMPLIANCE_REDIRECT;
        }

        // 1. Check for prohibited guarantee / certainty language
        for (Pattern p : PROHIBITED_PATTERNS) {
            if (p.matcher(response).find()) {
                log.warn("[ComplianceGuardrail] PROHIBITED pattern fired [{}] — redirecting response.", p.pattern());
                auditLogger.log(userId, policyId, role,
                        AuditAction.COMPLIANCE_GUARDRAIL_FIRED,
                        Map.of("reason", "prohibited_guarantee_language", "pattern", p.pattern()),
                        true, AuditStatus.HOLD_FOR_MANUAL_REVIEW);
                return COMPLIANCE_REDIRECT;
            }
        }

        // 2. Monetary value present → verify at least one Tier framing term exists
        if (MONETARY_PATTERN.matcher(response).find()) {
            boolean hasFraming = TIER_FRAMING_TERMS.stream()
                    .anyMatch(term -> Pattern.compile("(?i)" + term).matcher(response).find());
            if (!hasFraming) {
                log.warn("[ComplianceGuardrail] Monetary value detected without required 3-tier framing — redirecting response.");
                auditLogger.log(userId, policyId, role,
                        AuditAction.COMPLIANCE_GUARDRAIL_FIRED,
                        Map.of("reason", "monetary_value_missing_tier_framing"),
                        true, AuditStatus.HOLD_FOR_MANUAL_REVIEW);
                return COMPLIANCE_REDIRECT;
            }
        }

        return response;
    }

    /**
     * Convenience overload for call sites that don't have caller context
     * (e.g. unit tests, internal pipelines). Uses anonymous identity.
     */
    public String enforce(String response) {
        return enforce(response, "anonymous", "unknown", "unknown");
    }
}
