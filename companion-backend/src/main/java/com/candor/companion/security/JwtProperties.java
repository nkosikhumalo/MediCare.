package com.candor.companion.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds to {@code companion.jwt.*} in application.properties.
 * <p>
 * {@code signingSecret} is the MOCK end-user identity signing key — completely
 * separate from, and unrelated to, the AI Gateway's OAuth2 client-credentials
 * used elsewhere in the system. Mixing these two up is exactly the trust-boundary
 * violation the brief warns against, so they are intentionally configured,
 * injected, and named distinctly.
 */
@ConfigurationProperties(prefix = "companion.jwt")
public class JwtProperties {

    /** HMAC signing secret for the mock end-user JWT. Local/dev only — replace with RS256 + real key management for the finals. */
    private String signingSecret = "dev-only-mock-signing-secret-change-me-please-32chars";

    /** Expected issuer claim. */
    private String issuer = "https://companion.candor.local/mock-idp";

    /** Expected audience claim. */
    private String audience = "candor-life-companion";

    /** Token lifetime in seconds — kept short per the brief's least-privilege guidance. */
    private long expirySeconds = 900; // 15 minutes

    public String getSigningSecret() { return signingSecret; }
    public void setSigningSecret(String signingSecret) { this.signingSecret = signingSecret; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }

    public long getExpirySeconds() { return expirySeconds; }
    public void setExpirySeconds(long expirySeconds) { this.expirySeconds = expirySeconds; }
}
