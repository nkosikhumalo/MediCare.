package com.candor.companion.security;

import com.candor.companion.domain.CompanionRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MockJwtServiceTest {

    private final JwtProperties properties = new JwtProperties();
    private final MockJwtService service = new MockJwtService(properties);

    @Test
    void issuesAndValidatesATokenRoundTrip() {
        String token = service.issueToken("user-policyholder-1", CompanionRole.POLICYHOLDER, "POL-1001", false);

        Claims claims = service.parseAndValidate(token);

        assertEquals("user-policyholder-1", claims.getSubject());
        assertEquals(CompanionRole.POLICYHOLDER, MockJwtService.roleFromClaims(claims));
        assertEquals("POL-1001", MockJwtService.policyIdFromClaims(claims));
        assertFalse(MockJwtService.deceasedFlagFromClaims(claims));
    }

    @Test
    void rejectsATamperedToken() {
        String token = service.issueToken("user-1", CompanionRole.BENEFICIARY, "POL-2002", true);
        // Flip a character in the signature segment to simulate tampering.
        String tampered = token.substring(0, token.length() - 4) + "abcd";

        assertThrows(JwtException.class, () -> service.parseAndValidate(tampered));
    }

    @Test
    void rejectsATokenSignedWithADifferentSecret() {
        JwtProperties otherProperties = new JwtProperties();
        otherProperties.setSigningSecret("a-completely-different-signing-secret-value-here");
        MockJwtService otherService = new MockJwtService(otherProperties);

        String token = otherService.issueToken("user-1", CompanionRole.POLICYHOLDER, "POL-1001", false);

        assertThrows(JwtException.class, () -> service.parseAndValidate(token));
    }
}
