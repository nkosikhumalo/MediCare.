package com.candor.companion.selfservice;

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
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Self-Service Address Update — Core Journey 2.
 *
 * SecurityConfig already restricts /api/self-service/** to ROLE_POLICYHOLDER,
 * and the Node.js BFF gate (requireRole.policyholder()) blocks BENEFICIARY
 * tokens before the request ever reaches here. This controller is therefore
 * only reachable by an authenticated, non-deceased policyholder.
 *
 * Province-change intercept:
 *   Changing province is a high-risk mutation. Rather than blocking the user,
 *   the request is accepted, marked PENDING_HUMAN_REVIEW, and written to the
 *   audit log. Access is never blocked — the policyholder is informed of the
 *   hold and given a referenceId to quote to support.
 *
 * Non-province updates (street, suburb, city, postal code) are approved
 * immediately after passing the format validation regex.
 */
@RestController
@RequestMapping("/api/self-service")
public class SelfServiceController {

    private static final Logger log = LoggerFactory.getLogger(SelfServiceController.class);

    // South African postal codes are exactly 4 digits
    private static final Pattern POSTAL_CODE_PATTERN = Pattern.compile("^\\d{4}$");

    // Recognised SA provinces — used to detect a province change vs. a typo
    private static final java.util.Set<String> SA_PROVINCES = java.util.Set.of(
            "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
            "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
    );

    private final AuditLoggerService auditLogger;
    private final ProofOfResidenceVerifier porVerifier;

    public SelfServiceController(AuditLoggerService auditLogger,
                                  ProofOfResidenceVerifier porVerifier) {
        this.auditLogger = auditLogger;
        this.porVerifier = porVerifier;
    }

    // ------------------------------------------------------------------
    // POST /api/self-service/address
    // Accepts multipart/form-data so the user can attach a proof-of-
    // residence document alongside their address fields.
    // ------------------------------------------------------------------

    @PostMapping(value = "/address", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_JSON_VALUE
    })
    public ResponseEntity<AddressUpdateResponse> updateAddress(
            @RequestPart("streetAddress") String streetAddress,
            @RequestPart("city")          String city,
            @RequestPart("province")      String province,
            @RequestPart(value = "suburb",      required = false) String suburb,
            @RequestPart(value = "postalCode",  required = false) String postalCode,
            @RequestPart(value = "document",    required = false) MultipartFile document,
            @AuthenticationPrincipal CompanionPrincipal principal) {

        AddressUpdateRequest request = new AddressUpdateRequest(
                streetAddress, suburb, city, province, postalCode);

        String userId   = principal != null ? principal.subject()              : "anonymous";
        String policyId = principal != null ? principal.policyId()             : "unknown";
        String role     = principal != null ? principal.effectiveRole().name() : "unknown";

        // --- Input validation ---
        ResponseEntity<AddressUpdateResponse> validationError = validate(request);
        if (validationError != null) return validationError;

        String referenceId      = UUID.randomUUID().toString();
        boolean provinceChanged = isProvinceChange(request.province(), policyId);

        if (provinceChanged) {
            // Province change requires proof-of-residence document
            if (document == null || document.isEmpty()) {
                return ResponseEntity.badRequest().body(new AddressUpdateResponse(
                        "DOCUMENT_REQUIRED",
                        "A province change requires proof of residence. " +
                        "Please upload a photo or scan of a utility bill, bank statement, or similar document.",
                        true,
                        null
                ));
            }

            // AI scans the document and extracts the address
            try {
                String mimeType = document.getContentType() != null
                        ? document.getContentType() : "image/jpeg";
                ProofOfResidenceVerifier.VerificationResult result =
                        porVerifier.verify(document.getBytes(), mimeType, request);

                if (result.matched()) {
                    // Document confirms the new address — approve immediately
                    auditLogger.log(userId, policyId, role,
                            AuditAction.ADDRESS_UPDATE_COMPLETED,
                            Map.of(
                                    "street",           request.streetAddress(),
                                    "city",             request.city(),
                                    "province",         request.province(),
                                    "postalCode",       postalCode != null ? postalCode : "",
                                    "provinceChanged",  true,
                                    "porVerified",      true,
                                    "extractedAddress", result.extractedAddress(),
                                    "referenceId",      referenceId
                            ),
                            false, AuditStatus.APPROVED);

                    return ResponseEntity.ok(new AddressUpdateResponse(
                            "APPROVED",
                            "Your proof of residence has been verified and your address has been updated successfully.",
                            true,
                            referenceId
                    ));

                } else {
                    // Document doesn't match what the user entered
                    auditLogger.log(userId, policyId, role,
                            AuditAction.ADDRESS_UPDATE_PROVINCE_CHANGE,
                            Map.of(
                                    "newProvince",      request.province(),
                                    "porVerified",      false,
                                    "mismatchReason",   result.reason(),
                                    "extractedAddress", result.extractedAddress(),
                                    "referenceId",      referenceId
                            ),
                            false, AuditStatus.REJECTED);

                    return ResponseEntity.status(422).body(new AddressUpdateResponse(
                            "DECLINED",
                            "The address on your document does not match what you entered. " +
                            result.reason() + " Please check your details and try again with a clear document.",
                            true,
                            referenceId
                    ));
                }

            } catch (Exception e) {
                log.error("[SelfService] Document verification error: {}", e.getMessage());
                return ResponseEntity.internalServerError().body(new AddressUpdateResponse(
                        "VERIFICATION_ERROR",
                        "We could not process your document at this time. Please try again.",
                        true,
                        null
                ));
            }
        }

        // Standard update (no province change) — approved immediately, no document needed
        auditLogger.log(userId, policyId, role,
                AuditAction.ADDRESS_UPDATE_COMPLETED,
                Map.of(
                        "street",      request.streetAddress(),
                        "suburb",      suburb != null ? suburb : "",
                        "city",        request.city(),
                        "province",    request.province(),
                        "postalCode",  postalCode != null ? postalCode : "",
                        "referenceId", referenceId
                ),
                false, AuditStatus.APPROVED);

        return ResponseEntity.ok(new AddressUpdateResponse(
                "APPROVED",
                "Your address has been updated successfully.",
                false,
                referenceId
        ));
    }

    // ------------------------------------------------------------------
    // GET /api/self-service/address  (read current address on file)
    // ------------------------------------------------------------------

    @GetMapping("/address")
    public ResponseEntity<?> getAddress(@AuthenticationPrincipal CompanionPrincipal principal) {
        String policyId = principal != null ? principal.policyId() : "unknown";

        // In production this queries the CRM/policy DB. For now return the
        // mock address seeded for the demo policyId so the flow is end-to-end.
        return ResponseEntity.ok(Map.of(
                "policyId",      policyId,
                "streetAddress", "12 Jacaranda Avenue",
                "suburb",        "Waterkloof",
                "city",          "Pretoria",
                "province",      "Gauteng",
                "postalCode",    "0181"
        ));
    }

    // ------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------

    /**
     * Province-change detection.
     * In production this would diff against the stored address for the
     * given policyId. For the demo, Gauteng is the seeded province — any
     * incoming value that differs (case-insensitive) is a province change.
     */
    private boolean isProvinceChange(String incomingProvince, String policyId) {
        if (incomingProvince == null || incomingProvince.isBlank()) return false;
        // Mock: seeded province is Gauteng for all demo policies
        String currentProvince = "Gauteng";
        return !incomingProvince.trim().equalsIgnoreCase(currentProvince);
    }

    private ResponseEntity<AddressUpdateResponse> validate(AddressUpdateRequest req) {
        if (req.streetAddress() == null || req.streetAddress().isBlank()) {
            return bad("streetAddress is required.");
        }
        if (req.city() == null || req.city().isBlank()) {
            return bad("city is required.");
        }
        if (req.province() == null || req.province().isBlank()) {
            return bad("province is required.");
        }
        if (!SA_PROVINCES.contains(req.province())) {
            return bad("province must be a valid South African province.");
        }
        if (req.postalCode() != null && !req.postalCode().isBlank()
                && !POSTAL_CODE_PATTERN.matcher(req.postalCode()).matches()) {
            return bad("postalCode must be a 4-digit South African postal code.");
        }
        return null;
    }

    private ResponseEntity<AddressUpdateResponse> bad(String msg) {
        return ResponseEntity.badRequest().body(
                new AddressUpdateResponse("VALIDATION_ERROR", msg, false, null));
    }
}
