package com.candor.companion.whatif;

import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

/**
 * Months-to-factor lookup from the Virtual Phase Brief, Appendix A4.
 * <p>
 * The brief only defines factors at five discrete waiting-period brackets
 * (0, 3, 6, 12, 24 months). It does not specify how to treat a value that
 * falls between brackets (e.g. 9 months), so this table deliberately picks
 * a conservative, documented interpretation: the factor for the nearest
 * bracket at or below the requested months is used (a "floor" lookup). That
 * choice, and the fact that it is an assumption rather than a brief
 * requirement, is called out in SUBMISSION.md Section 11 (Assumptions and
 * Open Questions).
 */
final class WhatIfFactorTable {

    private static final NavigableMap<Integer, Double> FACTORS_BY_MONTHS = new TreeMap<>(Map.of(
            0, 1.0,
            3, 0.95,
            6, 0.9,
            12, 0.82,
            24, 0.72
    ));

    private WhatIfFactorTable() {
    }

    /**
     * Resolves the factor for the given waiting period.
     *
     * @param months requested waiting period in months; must be non-negative
     * @return the factor for the nearest defined bracket at or below
     *         {@code months}, or the smallest bracket's factor if
     *         {@code months} is below every defined bracket
     * @throws IllegalArgumentException if {@code months} is negative
     */
    static double factorFor(int months) {
        if (months < 0) {
            throw new IllegalArgumentException("months must not be negative: " + months);
        }
        Map.Entry<Integer, Double> flooredBracket = FACTORS_BY_MONTHS.floorEntry(months);
        // months is non-negative and the lowest bracket is 0, so floorEntry
        // only returns null if the map itself is empty, which it never is.
        return flooredBracket != null ? flooredBracket.getValue() : FACTORS_BY_MONTHS.firstEntry().getValue();
    }
}
