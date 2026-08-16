package com.candor.companion.selfservice;

/**
 * Outbound result of a self-service address update.
 *
 * @param status          "APPROVED" | "PENDING_HUMAN_REVIEW"
 * @param message         human-readable explanation of the outcome
 * @param provinceChanged true when a province change triggered the hold
 * @param referenceId     audit reference the policyholder can quote to support
 */
public record AddressUpdateResponse(
        String status,
        String message,
        boolean provinceChanged,
        String referenceId
) {}
