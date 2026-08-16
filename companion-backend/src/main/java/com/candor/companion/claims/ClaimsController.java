package com.candor.companion.claims;

import com.candor.companion.domain.AuditLoggerService;
import com.candor.companion.domain.AuditLoggerService.AuditAction;
import com.candor.companion.domain.AuditLoggerService.AuditStatus;
import com.candor.companion.security.CompanionPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Claims Controller — Java side.
 *
 * Only one endpoint lives here: document validation.
 * The FNOL ticket creation, status queries, and document persistence
 * all live in the Node BFF (where PostgreSQL is), because Java doesn't
 * have a direct Postgres connection in this architecture.
 *
 * POST /api/claims/{claimId}/validate-document
 *   Accepts the uploaded file, runs ClaimsDocumentValidator (vision AI),
 *   audit-logs the result, and returns the structured ValidationResult JSON
 *   back to the Node BFF which persists it and forwards it to the client.
 *
 * Accessible by both ROLE_POLICYHOLDER and ROLE_BENEFICIARY —
 * SecurityConfig already permits /api/claims/** to hasAnyRole("POLICYHOLDER","BENEFICIARY").
 */
@RestController
@RequestMapping("/api/claims")
public class ClaimsController {

    private static final Logger log = LoggerFactory.getLogger(ClaimsController.class);

    private final ClaimsDocumentValidator validator;
    private final AuditLoggerService      auditLogger;

    public ClaimsController(ClaimsDocumentValidator validator, AuditLoggerService auditLogger) {
        this.validator   = validator;
        this.auditLogger = auditLogger;
    }

    @PostMapping(
            value    = "/{claimId}/validate-document",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> validateDocument(
            @PathVariable("claimId")                              String claimId,
            @RequestPart("document")                              MultipartFile document,
            @RequestPart(value = "docType",    required = false)  String docType,
            @RequestPart(value = "policyName", required = false)  String policyName,
            @RequestPart(value = "policyId",   required = false)  String policyId,
            @AuthenticationPrincipal CompanionPrincipal principal) {

        String userId  = principal != null ? principal.subject()              : "anonymous";
        String polId   = policyId  != null ? policyId : (principal != null ? principal.policyId() : "unknown");
        String role    = principal != null ? principal.effectiveRole().name() : "unknown";
        String polName = policyName != null ? policyName : "unknown";
        String dtype   = docType    != null ? docType    : "UNKNOWN";

        if (document == null || document.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No document file received."));
        }

        try {
            String mimeType = document.getContentType() != null
                    ? document.getContentType() : "image/jpeg";

            ClaimsDocumentValidator.ValidationResult result =
                    validator.validate(document.getBytes(), mimeType, dtype, polName, polId);

            // Audit every document validation — valid or not
            auditLogger.log(userId, polId, role,
                    result.isValid() ? AuditAction.CLAIM_DOCS_COLLECTED : AuditAction.CLAIM_SUBMITTED,
                    Map.of(
                            "claimId",        claimId,
                            "docType",        result.docType(),
                            "expectedType",   dtype,
                            "isValid",        result.isValid(),
                            "matchesPolicy",  result.matchesPolicy(),
                            "qualityIssue",   result.qualityIssue() != null ? result.qualityIssue() : "none",
                            "fileName",       document.getOriginalFilename() != null
                                              ? document.getOriginalFilename() : "unknown"
                    ),
                    !result.isValid(),
                    result.isValid() ? AuditStatus.APPROVED : AuditStatus.HOLD_FOR_MANUAL_REVIEW
            );

            return ResponseEntity.status(result.isValid() ? 200 : 422).body(Map.of(
                    "isValid",        result.isValid(),
                    "docType",        result.docType(),
                    "extractedName",  result.extractedName()  != null ? result.extractedName()  : "",
                    "extractedId",    result.extractedId()    != null ? result.extractedId()    : "",
                    "dateOfDeath",    result.dateOfDeath()    != null ? result.dateOfDeath()    : "",
                    "matchesPolicy",  result.matchesPolicy(),
                    "feedback",       result.feedback(),
                    "qualityIssue",   result.qualityIssue()   != null ? result.qualityIssue()   : ""
            ));

        } catch (Exception e) {
            log.error("[ClaimsController] Validation error claimId={}: {}", claimId, e.getMessage());
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Document validation failed: " + e.getMessage()));
        }
    }
}
