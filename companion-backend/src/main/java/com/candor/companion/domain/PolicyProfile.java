package com.candor.companion.domain;

/**
 * A stand-in for the real policy/CRM record that a production backend would
 * query. In the finals build this becomes a Postgres-backed repository; for
 * the virtual/design phase it is an in-memory mock so the auth/authorization
 * design can be demonstrated end-to-end without a real database dependency
 * in the Environment Shell.
 *
 * @param policyId               the policy this profile belongs to
 * @param policyholderUserId     the subject id of the policyholder
 * @param linkedBeneficiaryUserId the subject id of a linked beneficiary, if any (nullable)
 * @param deceased               server-of-record deceased flag — this, not the JWT claim,
 *                                is what the backend trusts when deriving the effective role
 */
public record PolicyProfile(
        String policyId,
        String policyholderUserId,
        String linkedBeneficiaryUserId,
        boolean deceased
) {
}
