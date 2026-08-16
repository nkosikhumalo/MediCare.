package com.candor.companion.whatif;

/**
 * Outbound result of a What-If premium simulation (Core Journey 3).
 * <p>
 * Shaped as structured JSON on purpose: the gateway documentation flags
 * the Python SDK's structured-output mode as unreliable, so this backend
 * does the calculation natively and returns a fixed, predictable shape.
 * The chat layer's job is to narrate {@code tradeOffSummary} in a warm,
 * conversational way — never to recompute or restate the numbers itself.
 *
 * @param estimatedPremium    the simulated new premium, in Rand, rounded to 2 decimal places
 * @param appliedFactor       the waiting-period factor used in the calculation (Appendix A4)
 * @param waitingPeriodMonths the waiting period, in months, the factor was resolved for
 * @param isFinalQuote        always {@code false}; per Appendix A4 this must never be
 *                            presented to the user as a final quote
 * @param tradeOffSummary     a plain-language explanation of the trade-off being simulated
 * @param humanReviewOffered  always {@code true}; per Appendix A4/A6 the assistant must
 *                            offer human review alongside every simulation result
 */
public record WhatIfResponse(
        double estimatedPremium,
        double appliedFactor,
        int waitingPeriodMonths,
        boolean isFinalQuote,
        String tradeOffSummary,
        boolean humanReviewOffered
) {
}
