package com.candor.companion.web;

import com.candor.companion.domain.CompanionRole;
import com.candor.companion.domain.PolicyProfile;
import com.candor.companion.domain.ProfileStore;
import com.candor.companion.security.MockJwtService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * DEV-ONLY endpoint that plays the part of "the host app just authenticated
 * the user via mock OIDC and is now handing off a signed identity token to
 * the embedded companion" (see SUBMISSION.md Section 5.3).
 * <p>
 * In the real reference architecture this issuance belongs to the HOST
 * app, not the companion backend — the companion only ever validates
 * tokens, it does not mint them for itself. This endpoint exists purely so
 * the Environment Shell is runnable end-to-end (login → embedded chat →
 * protected call) without standing up a separate host app and real IdP for
 * the design round. It is explicitly permitAll() in {@code SecurityConfig}
 * and must be removed (or replaced by the real host) before any
 * non-local deployment.
 */
@RestController
@RequestMapping("/api/dev")
public class AuthController {

    private final MockJwtService jwtService;
    private final ProfileStore profileStore;

    public AuthController(MockJwtService jwtService, ProfileStore profileStore) {
        this.jwtService = jwtService;
        this.profileStore = profileStore;
    }

    public record MockLoginRequest(
            @NotBlank String subject,
            @NotBlank String policyId,
            @NotBlank String requestedRole // "POLICYHOLDER" or "BENEFICIARY"
    ) {}

    @PostMapping("/mock-token")
    public ResponseEntity<?> issueMockToken(@RequestBody MockLoginRequest request) {
        var profile = profileStore.findByPolicyId(request.policyId());
        if (profile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "unknown policyId"));
        }

        CompanionRole requestedRole = CompanionRole.valueOf(request.requestedRole().toUpperCase());

        // The token carries the deceased flag as of issuance time purely for
        // transparency/debugging; the real authorization decision is always
        // re-derived server-side from ProfileStore on every subsequent
        // request (see JwtAuthenticationFilter), never trusted from this claim.
        String token = jwtService.issueToken(
                request.subject(), requestedRole, request.policyId(), profile.get().deceased());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "expiresInSeconds", 900,
                "note", "Dev-only mock handoff token. In production this is issued by the host app, not this backend."
        ));
    }

    /** Convenience listing so a judge/teammate can see valid demo policy ids without reading the code. */
    @PostMapping("/demo-profiles")
    public ResponseEntity<?> demoProfiles() {
        return ResponseEntity.ok(Map.of(
                "POL-1001", "active policyholder + linked beneficiary, not deceased",
                "POL-2002", "policyholder DECEASED — beneficiary token for this policy is promoted to restricted role"
        ));
    }
}
