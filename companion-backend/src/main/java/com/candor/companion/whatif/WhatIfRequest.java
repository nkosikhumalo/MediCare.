package com.candor.companion.whatif;

/**
 * Inbound payload for a What-If premium simulation (Core Journey 3).
 * <p>
 * All fields are required. This is deliberately a plain request record
 * rather than something the AI Gateway populates: per the brief, the
 * gateway has no native tool-calling, so the chat layer's job is to
 * gather these values conversationally and hand them to this backend
 * endpoint — the model never performs the calculation itself.
 *
 * @param currentPremium      the policyholder's current premium, in Rand
 * @param currentSumAssured   the current sum assured on the policy, in Rand
 * @param requestedSumAssured the sum assured the user wants to explore, in Rand
 * @param waitingPeriodMonths the waiting period, in months, being simulated
 */
public record WhatIfRequest(
        double currentPremium,
        double currentSumAssured,
        double requestedSumAssured,
        int waitingPeriodMonths
) {
}
