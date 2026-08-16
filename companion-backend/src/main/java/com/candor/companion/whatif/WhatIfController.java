package com.candor.companion.whatif;

import com.candor.companion.domain.AuditLoggerService;
import com.candor.companion.domain.AuditLoggerService.AuditAction;
import com.candor.companion.security.CompanionPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Core Journey 3: Quotes &amp; What-If Simulations.
 * <p>
 * Registered under {@code /api/what-if/**}, which {@code SecurityConfig}
 * already restricts to {@code POLICYHOLDER} (Appendix A2: beneficiaries
 * are blocked from What-If).
 */
@RestController
public class WhatIfController {

    private final WhatIfCalculationService whatIfCalculationService;
    private final AuditLoggerService auditLogger;

    public WhatIfController(WhatIfCalculationService whatIfCalculationService,
                            AuditLoggerService auditLogger) {
        this.whatIfCalculationService = whatIfCalculationService;
        this.auditLogger = auditLogger;
    }

    @PostMapping("/api/what-if/simulate")
    public ResponseEntity<WhatIfResponse> simulate(
            @AuthenticationPrincipal CompanionPrincipal principal,
            @Valid @RequestBody WhatIfRequest request
    ) {
        String userId   = principal != null ? principal.subject()           : "anonymous";
        String policyId = principal != null ? principal.policyId()          : "unknown";
        String role     = principal != null ? principal.effectiveRole().name() : "unknown";

        WhatIfResponse result = whatIfCalculationService.simulate(request);

        auditLogger.log(userId, policyId, role,
                AuditAction.WHAT_IF_SIMULATED,
                Map.of(
                        "currentPremium",      request.currentPremium(),
                        "currentSumAssured",   request.currentSumAssured(),
                        "requestedSumAssured", request.requestedSumAssured(),
                        "waitingPeriodMonths", request.waitingPeriodMonths(),
                        "estimatedPremium",    result.estimatedPremium(),
                        "isFinalQuote",        result.isFinalQuote()
                ));

        return ResponseEntity.ok(result);
    }
}
