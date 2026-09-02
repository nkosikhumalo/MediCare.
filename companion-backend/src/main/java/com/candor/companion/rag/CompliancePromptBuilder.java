package com.candor.companion.rag;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * CompliancePromptBuilder
 *
 * Composes the final system prompt sent to the LLM on every request.
 * Three layers in order:
 *
 *   Layer 1 - Empathy and Mode (empathetic-claims-system-prompt.md)
 *             Loaded once at startup. Governs persona, tone, state-based
 *             operational mode (Claims vs Self-Service), and memory rules.
 *
 *   Layer 2 - Runtime session directive (injected when deceasedFlag == true)
 *             Explicitly activates Claims Mode for the current request.
 *
 *   Layer 3 - Compliance guardrails (inline constant)
 *             Zero-hallucination policy, financial prohibition rules,
 *             3-tier value taxonomy. Do NOT alter without compliance review.
 */
@Component
public class CompliancePromptBuilder {

    private static final Logger log = LoggerFactory.getLogger(CompliancePromptBuilder.class);

    @Value("classpath:prompts/empathetic-claims-system-prompt.md")
    private Resource empathyPromptResource;

    private String empathyPromptContent;

    @PostConstruct
    void loadEmpathyPrompt() {
        try {
            empathyPromptContent = empathyPromptResource.getContentAsString(StandardCharsets.UTF_8);
            log.info("[CompliancePromptBuilder] Empathetic claims prompt loaded ({} chars).",
                    empathyPromptContent.length());
        } catch (IOException e) {
            log.error("[CompliancePromptBuilder] Failed to load empathetic-claims-system-prompt.md " +
                      "- falling back to compliance-only prompt.", e);
            empathyPromptContent = "";
        }
    }

    // -------------------------------------------------------------------------
    // Layer 2 — deceased-flag runtime directive
    // -------------------------------------------------------------------------
    private static final String DECEASED_FLAG_DIRECTIVE =
        "---\n" +
        "RUNTIME SESSION DIRECTIVE: CLAIMS MODE ACTIVE\n\n" +
        "The authenticated session for this conversation has deceasedFlag == true.\n" +
        "You MUST immediately activate Mode 1: Empathetic Claims Mode (Section 3).\n" +
        "- Self-service mutations (address updates, premium recalculations) are DISABLED.\n" +
        "- Focus 100% on empathetic claims guidance and document checklist support.\n" +
        "- Acknowledge grief before any procedural explanation.\n" +
        "---\n\n";

    // -------------------------------------------------------------------------
    // Layer 3 — compliance guardrails. Do NOT alter without a compliance review.
    // -------------------------------------------------------------------------
    private static final String COMPLIANCE_LAYER =
        "---\n" +
        "SYSTEM INSTRUCTION: SECURE POLICY & COMPLIANCE KNOWLEDGE ASSISTANT\n\n" +
        "5. CONTEXT-ONLY GROUNDING RULES (ZERO-HALLUCINATION POLICY)\n" +
        "- Answer EXCLUSIVELY from the POLICY CONTEXT SNIPPETS block below.\n" +
        "- Do NOT draw upon external knowledge, world facts, or assumptions outside of the provided context.\n" +
        "- If the snippets lack sufficient detail, tell the user you could not find that information in the " +
        "available policy documents and recommend they contact a MediCare consultant or financial adviser. " +
        "Do NOT guess, invent, or fill in gaps from general knowledge.\n" +
        "- NEVER extrapolate, guess, speculate, or deduce implicit facts not directly stated.\n\n" +
        "6. COMPLIANCE AND FINANCIAL GUARDRAILS\n\n" +
        "A. ABSOLUTE PROHIBITIONS - you MUST NEVER state, imply, or suggest:\n" +
        "  1. That an individual customer's claim is guaranteed to be approved.\n" +
        "  2. That a customer or beneficiary will receive a specific or exact monetary payout.\n" +
        "  3. That an estimated, calculated, or illustrative policy value is a confirmed payout.\n" +
        "  4. That an Instant Cash value is payable before all required assessment steps complete.\n" +
        "  5. An exact or guaranteed payment date.\n" +
        "  6. That meeting an SLA time frame guarantees claim approval or payment.\n\n" +
        "B. PERMITTED COMPLIANCE BEHAVIOURS:\n" +
        "  1. You MAY use terms such as premium guarantee or guaranteed cover period ONLY when " +
        "directly explaining documented policy features grounded in the text.\n" +
        "  2. You MAY explain the claims-assessment process, indicative timelines, exclusions, " +
        "document requirements, and general conditions.\n" +
        "  3. You MAY state what may be payable provided all defined requirements are met.\n" +
        "  4. You MAY quote documented contractual amounts from the snippets (e.g. policy fees, " +
        "minimum premiums, discounts) when they appear in POLICY CONTEXT SNIPPETS. Frame them as " +
        "documented guide values subject to the customer's actual policy terms — not as a " +
        "confirmed personal quote or claim payout.\n\n" +
        "C. MANDATORY 3-TIER VALUE TAXONOMY:\n" +
        "Whenever monetary amounts or policy values appear, categorise them explicitly:\n" +
        "  Tier 1 - Recorded or Illustrative Value: Frame as a recorded benefit, documented fee, " +
        "or model estimate (use phrases like 'as documented', 'policy fee', 'subject to').\n" +
        "  Tier 2 - Potentially Payable Amount: Frame as what may be payable subject to policy terms.\n" +
        "  Tier 3 - Confirmed Outcome: State that final amounts are ONLY determined after full " +
        "validation, underwriting verification, and formal claims assessment.\n\n" +
        "7. CONDITIONAL AND RISK-AWARE LANGUAGE\n" +
        "Remain objective and conditional. Qualify statements with downstream dependencies " +
        "(e.g., subject to policy status, documentation verification, and claims assessment).\n\n" +
        "8. POLICY CONTEXT SNIPPETS:\n" +
        "{{INSERT_RETRIEVED_CHUNKS_HERE}}\n";

    /**
     * Builds the complete system prompt for a request.
     *
     * @param contextBlock  Pre-formatted RAG context from RagRetrievalService.
     * @param deceasedFlag  True when the session is in Claims Support mode.
     * @return              Complete system prompt ready for the LLM call.
     */
    public String build(String contextBlock, boolean deceasedFlag) {
        StringBuilder prompt = new StringBuilder();

        // Layer 1: Empathy and persona (loaded from .md file at startup)
        if (empathyPromptContent != null && !empathyPromptContent.isBlank()) {
            prompt.append(empathyPromptContent).append("\n\n");
        }

        // Layer 2: Runtime claims-mode activation (only when deceased flag is set)
        if (deceasedFlag) {
            prompt.append(DECEASED_FLAG_DIRECTIVE);
        }

        // Layer 3: Compliance guardrails + RAG context
        prompt.append(COMPLIANCE_LAYER.replace("{{INSERT_RETRIEVED_CHUNKS_HERE}}", contextBlock));

        return prompt.toString();
    }

    /**
     * Convenience overload for call sites without session context (tests, smoke runs).
     */
    public String build(String contextBlock) {
        return build(contextBlock, false);
    }
}
