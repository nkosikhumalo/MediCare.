package com.candor.companion.web;

import com.candor.companion.security.CompanionPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Thin placeholder endpoints so the auth/role enforcement can be
 * demonstrated end-to-end (200 vs 403) before the real Q&A / What-If /
 * self-service / claims logic exists. Members 2–5 replace the bodies of
 * these handlers with their actual feature logic; the URL patterns and
 * role rules below already match SecurityConfig and the capability matrix,
 * so nobody needs to touch security wiring to build their journey.
 */
@RestController
public class DemoProtectedController {

    @GetMapping("/api/qa/ping")
    public ResponseEntity<?> qaPing(@AuthenticationPrincipal CompanionPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "message", "Policy Q&A reachable by both roles.",
                "effectiveRole", principal.effectiveRole(),
                "policyId", principal.policyId()
        ));
    }

    @GetMapping("/api/claims/ping")
    public ResponseEntity<?> claimsPing(@AuthenticationPrincipal CompanionPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "message", "Claims support reachable by both roles.",
                "effectiveRole", principal.effectiveRole(),
                "policyId", principal.policyId()
        ));
    }

    @GetMapping("/api/what-if/ping")
    public ResponseEntity<?> whatIfPing(@AuthenticationPrincipal CompanionPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "message", "What-If reachable by POLICYHOLDER only — a BENEFICIARY token gets a 403 here.",
                "effectiveRole", principal.effectiveRole(),
                "policyId", principal.policyId()
        ));
    }

    @GetMapping("/api/self-service/ping")
    public ResponseEntity<?> selfServicePing(@AuthenticationPrincipal CompanionPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "message", "Self-service updates reachable by POLICYHOLDER only — a BENEFICIARY token gets a 403 here.",
                "effectiveRole", principal.effectiveRole(),
                "policyId", principal.policyId()
        ));
    }
}
