package com.candor.companion.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

/**
 * AuditLoggerService
 *
 * Records every high-risk or authorization-relevant action to a structured,
 * write-only audit trail. Entries are never updated or deleted, providing
 * a bulletproof paper trail for security and compliance review.
 *
 * Each log entry contains:
 *   - timestamp (ISO-8601 UTC)
 *   - userId / policyId / role
 *   - action (e.g. ADDRESS_UPDATE_PROVINCE_CHANGE, CLAIM_SUBMITTED)
 *   - details (action-specific key/value map)
 *   - escalationTriggered flag
 *   - status (e.g. APPROVED, HOLD_FOR_MANUAL_REVIEW)
 *
 * At Finals: persist entries to a Postgres audit_log table (append-only,
 * no UPDATE/DELETE permissions on that table) — same API surface as this
 * structured log output.
 */
@Service
public class AuditLoggerService {

    private static final Logger log = LoggerFactory.getLogger(AuditLoggerService.class);

    public enum AuditAction {
        ADDRESS_UPDATE_PROVINCE_CHANGE,
        ADDRESS_UPDATE_COMPLETED,
        CLAIM_SUBMITTED,
        CLAIM_DOCS_COLLECTED,
        WHAT_IF_SIMULATED,
        AUTH_ROLE_MISMATCH,
        AUTH_REJECTED,
        HIGH_RISK_FIELD_CHANGE,
        HUMAN_HANDOFF_TRIGGERED,
        // RAG / AI pipeline events
        RAG_QUERY,
        RAG_CHAT,
        COMPLIANCE_GUARDRAIL_FIRED,
        AI_PROVIDER_FALLBACK,
        AI_NO_PROVIDER
    }

    public enum AuditStatus {
        APPROVED,
        HOLD_FOR_MANUAL_REVIEW,
        REJECTED,
        PENDING
    }

    /**
     * Log an audit event.
     *
     * @param userId             the authenticated subject
     * @param policyId           the policy in scope
     * @param role               the effective role (POLICYHOLDER / BENEFICIARY)
     * @param action             what happened
     * @param details            action-specific context (e.g. old/new province)
     * @param escalationTriggered whether this event triggers human review
     * @param status             the outcome status
     */
    public void log(String userId,
                    String policyId,
                    String role,
                    AuditAction action,
                    Map<String, Object> details,
                    boolean escalationTriggered,
                    AuditStatus status) {

        // Structured log — at Finals this writes to Postgres instead
        log.info("[AUDIT] timestamp={} userId={} policyId={} role={} action={} details={} escalation={} status={}",
                Instant.now(),
                userId,
                policyId,
                role,
                action,
                details,
                escalationTriggered,
                status);
    }

    /** Convenience overload for non-escalating informational events. */
    public void log(String userId, String policyId, String role,
                    AuditAction action, Map<String, Object> details) {
        log(userId, policyId, role, action, details, false, AuditStatus.APPROVED);
    }
}
