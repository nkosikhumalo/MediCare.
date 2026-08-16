package com.candor.companion.selfservice;

/**
 * Inbound payload for a self-service address update (Core Journey 2).
 *
 * @param streetAddress  full street address line
 * @param suburb         suburb / town
 * @param city           city
 * @param province       province — a change here is treated as high-risk and
 *                       held for manual review instead of being applied immediately
 * @param postalCode     South African postal code (4 digits)
 */
public record AddressUpdateRequest(
        String streetAddress,
        String suburb,
        String city,
        String province,
        String postalCode
) {}
