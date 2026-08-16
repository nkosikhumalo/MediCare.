package com.candor.companion.whatif;

import org.springframework.stereotype.Service;

/**
 * Implements the What-If premium formula from the Virtual Phase Brief,
 * Appendix A4:
 *
 * <pre>
 *   new = max(200, current × (requested / current_sum) × factor)
 * </pre>
 *
 * This calculation is deliberately native backend logic and never routed
 * through the AI Gateway: the gateway is stateless with no tool-calling,
 * and financial arithmetic is not something a small chat model should be
 * trusted to perform. The chat layer only explains {@link WhatIfResponse}
 * in natural language after this service has produced it.
 */
@Service
public class WhatIfCalculationService {

    private static final double MINIMUM_PREMIUM = 200.0;

    /**
     * Runs the What-If simulation for the given inputs.
     *
     * @param request the simulation inputs
     * @return a structured, non-final estimate with a trade-off explanation
     * @throws IllegalArgumentException if {@code currentSumAssured} is not positive,
     *                                  or any monetary input is negative
     */
    public WhatIfResponse simulate(WhatIfRequest request) {
        validate(request);

        double factor = WhatIfFactorTable.factorFor(request.waitingPeriodMonths());

        double rawNewPremium = request.currentPremium()
                * (request.requestedSumAssured() / request.currentSumAssured())
                * factor;

        double estimatedPremium = round2(Math.max(MINIMUM_PREMIUM, rawNewPremium));

        return new WhatIfResponse(
                estimatedPremium,
                factor,
                request.waitingPeriodMonths(),
                false,
                buildTradeOffSummary(request, factor),
                true
        );
    }

    private String buildTradeOffSummary(WhatIfRequest request, double factor) {
        boolean increasingCover = request.requestedSumAssured() > request.currentSumAssured();
        boolean longerWaitingPeriod = factor < 1.0;

        StringBuilder summary = new StringBuilder();
        summary.append(increasingCover
                ? "Increasing your sum assured raises your estimated premium. "
                : "Reducing your sum assured lowers your estimated premium. ");

        if (longerWaitingPeriod) {
            summary.append("Choosing a longer waiting period brings the estimate back down, "
                    + "but it also means benefits only become payable further into the future.");
        } else {
            summary.append("With no waiting period applied, the full requested change is "
                    + "reflected immediately in the estimate.");
        }

        return summary.toString();
    }

    private void validate(WhatIfRequest request) {
        if (request.currentSumAssured() <= 0) {
            throw new IllegalArgumentException("currentSumAssured must be positive");
        }
        if (request.currentPremium() < 0 || request.requestedSumAssured() < 0) {
            throw new IllegalArgumentException("monetary fields must not be negative");
        }
        if (request.waitingPeriodMonths() < 0) {
            throw new IllegalArgumentException("waitingPeriodMonths must not be negative");
        }
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
