package com.candor.companion.domain;

/**
 * The two end-user roles from the brief (Appendix A2).
 * <p>
 * IMPORTANT: this is the role requested at login time. It is NOT
 * automatically the role a request is authorized under — see
 * {@link ProfileStore} and {@code JwtAuthenticationFilter}, which
 * re-derive the effective role from the server-side deceased flag on
 * every request rather than trusting the token's role claim blindly.
 */
public enum CompanionRole {
    POLICYHOLDER,
    BENEFICIARY
}
