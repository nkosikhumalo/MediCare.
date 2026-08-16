package com.candor.companion.security;

import com.candor.companion.domain.CompanionRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * Issues and validates the MOCK end-user identity token.
 * <p>
 * This stands in for two things that are out of scope to build for real this
 * week: (1) the host application's real OIDC login, and (2) the signed
 * host-to-companion handoff token described in the brief. Both are modelled
 * as a single JWT here with standard OIDC/JWT claims (sub, iss, aud, exp) plus
 * the challenge-specific claims required by Appendix A3 (role, policy id,
 * deceased flag).
 * <p>
 * This service is used in two places only:
 *  - {@code AuthController#issueMockToken} — a dev-only endpoint that plays
 *    the part of "the host just authenticated the user and is handing off
 *    identity", so the Environment Shell is runnable end-to-end without a
 *    real IdP.
 *  - {@code JwtAuthenticationFilter} — validates the token on every
 *    subsequent request to a protected endpoint.
 * <p>
 * NOTE ON SECRETS: {@link JwtProperties#getSigningSecret()} is a LOCAL MOCK
 * signing key for end-user identity only. It is unrelated to, and must never
 * be confused with, the AI Gateway's OAuth2 client-credentials secret used by
 * {@code GatewayService} later in the build — that credential authenticates
 * our backend to the gateway (machine-to-machine) and never appears
 * here.
 */
@Service
public class MockJwtService {

    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_POLICY_ID = "policyId";
    private static final String CLAIM_DECEASED_FLAG = "deceasedFlag";

    private final JwtProperties properties;
    private final SecretKey signingKey;

    public MockJwtService(JwtProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(
                properties.getSigningSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Issues a short-lived signed token carrying the mocked end-user identity.
     * In production this call belongs to the host app's login flow, not the
     * companion backend — it lives here only so the shell can be demoed
     * without a real IdP.
     */
    public String issueToken(String subject, CompanionRole role, String policyId, boolean deceasedFlag) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .issuer(properties.getIssuer())
                .audience().add(properties.getAudience()).and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(properties.getExpirySeconds())))
                .claim(CLAIM_ROLE, role.name())
                .claim(CLAIM_POLICY_ID, policyId)
                .claim(CLAIM_DECEASED_FLAG, deceasedFlag)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validates signature, issuer, audience, and expiry, then returns the
     * claims. Throws {@link JwtException} (or a subclass) on any failure —
     * callers must treat any exception here as "reject the request", never
     * as "fall back to an unauthenticated default".
     */
    public Claims parseAndValidate(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(properties.getIssuer())
                .requireAudience(properties.getAudience())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        // jjwt already enforces expiry, issuer, and audience above via
        // require*/verifyWith — this second check is a defence-in-depth
        // belt-and-braces guard so a future refactor of the parser config
        // can't silently drop expiry enforcement without a test failing loudly.
        if (claims.getExpiration() == null || claims.getExpiration().before(new Date())) {
            throw new JwtException("Token has no expiry or is expired");
        }
        return claims;
    }

    public static CompanionRole roleFromClaims(Claims claims) {
        return CompanionRole.valueOf(claims.get(CLAIM_ROLE, String.class));
    }

    public static String policyIdFromClaims(Claims claims) {
        return claims.get(CLAIM_POLICY_ID, String.class);
    }

    public static boolean deceasedFlagFromClaims(Claims claims) {
        Boolean value = claims.get(CLAIM_DECEASED_FLAG, Boolean.class);
        return value != null && value;
    }
}
