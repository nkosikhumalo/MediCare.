package com.candor.companion.security;

import com.candor.companion.domain.CompanionRole;
import com.candor.companion.domain.PolicyProfile;
import com.candor.companion.domain.ProfileStore;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Re-validates identity and re-authorizes on EVERY request, per the brief's
 * "server-side enforcement" requirement. Nothing about role is ever trusted
 * from the frontend, from a cached session flag, or blindly from the JWT's
 * own role claim — the effective role is recomputed here from the live
 * {@link ProfileStore} deceased flag on every call.
 * <p>
 * Invalid tokens and identities that are neither known local profiles nor
 * well-formed host/BFF account subjects remain unauthenticated; downstream
 * Spring Security endpoint rules reject them with 401/403. A verified host
 * account may use an account-scoped chat identity even without a policy id.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final MockJwtService jwtService;
    private final ProfileStore profileStore;

    public JwtAuthenticationFilter(MockJwtService jwtService, ProfileStore profileStore) {
        this.jwtService = jwtService;
        this.profileStore = profileStore;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(BEARER_PREFIX.length());

        try {
            Claims claims = jwtService.parseAndValidate(token);

            String subject = claims.getSubject();
            String policyId = MockJwtService.policyIdFromClaims(claims);
            CompanionRole requestedRole = MockJwtService.roleFromClaims(claims);
            boolean tokenDeceasedFlag = MockJwtService.deceasedFlagFromClaims(claims);

            Optional<PolicyProfile> profile = profileStore.resolveVerifiedAccount(
                    policyId, subject, requestedRole.name(), tokenDeceasedFlag);
            if (profile.isEmpty()) {
                log.warn("auth.reject reason=unknown_policy_or_account subject={} policyId={}", subject, policyId);
                filterChain.doFilter(request, response);
                return;
            }

            String resolvedPolicyId = profile.get().policyId();

            // Server-of-record deceased flag wins. If the token disagrees with
            // the profile store, log it loudly — that mismatch is either a
            // stale token or a tamper attempt, either way it's audit-worthy.
            boolean effectiveDeceasedFlag = profile.get().deceased();
            if (effectiveDeceasedFlag != tokenDeceasedFlag) {
                log.warn("auth.flag_mismatch subject={} policyId={} tokenFlag={} serverFlag={}",
                        subject, resolvedPolicyId, tokenDeceasedFlag, effectiveDeceasedFlag);
            }

            CompanionRole effectiveRole = deriveEffectiveRole(requestedRole, effectiveDeceasedFlag);

            CompanionPrincipal principal = new CompanionPrincipal(
                    subject, resolvedPolicyId, requestedRole, effectiveRole, effectiveDeceasedFlag);

            List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + effectiveRole.name()));

            var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info("auth.accept subject={} policyId={} requestedRole={} effectiveRole={}",
                    subject, resolvedPolicyId, requestedRole, effectiveRole);

        } catch (JwtException | IllegalArgumentException e) {
            log.warn("auth.reject reason=invalid_token detail={}", e.getMessage());
            // Leave SecurityContext empty; downstream authorization rules reject.
        }

        filterChain.doFilter(request, response);
    }

    /**
     * A deceased policyholder never re-promotes themselves; only a linked
     * beneficiary is promoted, and a beneficiary can never be demoted back to
     * policyholder just because the flag is false — role can only ever be
     * narrowed by this method, never widened beyond what was requested.
     */
    private CompanionRole deriveEffectiveRole(CompanionRole requestedRole, boolean deceasedFlag) {
        if (deceasedFlag && requestedRole == CompanionRole.BENEFICIARY) {
            return CompanionRole.BENEFICIARY;
        }
        if (deceasedFlag && requestedRole == CompanionRole.POLICYHOLDER) {
            // A policyholder profile marked deceased should not still be able
            // to self-authenticate as an active policyholder.
            return CompanionRole.BENEFICIARY;
        }
        return requestedRole;
    }
}
