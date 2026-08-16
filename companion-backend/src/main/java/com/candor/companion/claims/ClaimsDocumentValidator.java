package com.candor.companion.claims;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * Uses a vision LLM to validate uploaded claims documents.
 *
 * Checks performed:
 *   1. Document type verification — is this actually a Death Certificate / ID / bank statement?
 *   2. Field extraction — deceased name, ID number, date of death, stamps
 *   3. Cross-validation against supplied policyholder name/ID
 *   4. Quality check — blurry, cropped, missing stamp
 *
 * Returns a structured {@link ValidationResult} the controller persists to PostgreSQL.
 *
 * Provider cascade: Bifrost (Claude Opus) → OpenRouter (gpt-4o-mini vision).
 * Note: Bifrost/Bedrock Claude Opus is text-only; vision is handled by OpenRouter
 * until the gateway adds a vision-capable model.
 */
@Service
public class ClaimsDocumentValidator {

    private static final Logger log = LoggerFactory.getLogger(ClaimsDocumentValidator.class);

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String VISION_MODEL   = "openai/gpt-4o-mini";

    @Value("${ai.gateway.virtual-key:}")
    private String bifrostKey;

    @Value("${ai.gateway.base-url:}")
    private String bifrostBaseUrl;

    @Value("${ai.openrouter.api-key:}")
    private String openRouterApiKey;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient   http   = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public record ValidationResult(
            boolean isValid,
            String  docType,          // DEATH_CERTIFICATE | DHA_1663 | ID_DOCUMENT | BANK_STATEMENT | UNKNOWN
            String  extractedName,
            String  extractedId,
            String  dateOfDeath,
            boolean matchesPolicy,
            String  feedback,         // human-readable result for the user
            String  qualityIssue      // non-null if image quality is the problem
    ) {}

    /**
     * @param imageBytes      raw bytes of the uploaded document
     * @param mimeType        e.g. "image/jpeg"
     * @param expectedDocType the document type the user claims to be uploading
     * @param policyHolderName the name on the policy record (for cross-validation)
     * @param policyHolderId   the ID number on the policy record
     */
    public ValidationResult validate(byte[] imageBytes, String mimeType,
                                     String expectedDocType,
                                     String policyHolderName,
                                     String policyHolderId) {
        try {
            String base64 = Base64.getEncoder().encodeToString(imageBytes);
            String prompt = buildPrompt(expectedDocType, policyHolderName, policyHolderId);
            String raw    = callVisionModel(base64, mimeType, prompt);
            log.info("[ClaimsValidator] AI raw response: {}", raw);
            return parseResult(raw, policyHolderName, policyHolderId);

        } catch (Exception e) {
            log.error("[ClaimsValidator] Validation error: {}", e.getMessage());
            return new ValidationResult(
                    false, "UNKNOWN", null, null, null, false,
                    "Document validation failed: " + e.getMessage(), null);
        }
    }

    // -------------------------------------------------------------------------
    // Prompt
    // -------------------------------------------------------------------------

    private String buildPrompt(String expectedDocType, String policyName, String policyId) {
        return """
                You are a South African insurance document verification assistant.
                The user has uploaded a document they claim is: %s

                Perform the following checks and return ONLY a JSON object — no markdown, no explanation:

                {
                  "isValid":       true | false,
                  "docType":       "DEATH_CERTIFICATE" | "DHA_1663" | "ID_DOCUMENT" | "BANK_STATEMENT" | "UNKNOWN",
                  "extractedName": "<full name from document or null>",
                  "extractedId":   "<ID number from document or null>",
                  "dateOfDeath":   "<YYYY-MM-DD from document or null>",
                  "matchesPolicy": true | false,
                  "feedback":      "<one sentence for the user explaining the result>",
                  "qualityIssue":  "<describe quality problem or null>"
                }

                Rules:
                - isValid = true only if the document is the correct type AND is legible AND passes cross-validation.
                - matchesPolicy = true if the name/ID on the document matches the policy details below.
                - If the photo is too blurry, cropped, or missing official stamps, set isValid=false and describe in qualityIssue.
                - If the document type is wrong (e.g. user uploaded a utility bill instead of a death certificate), set docType=UNKNOWN.

                Policy record to cross-validate against:
                  Name : %s
                  ID   : %s
                """.formatted(expectedDocType, policyName, policyId);
    }

    // -------------------------------------------------------------------------
    // Vision API call
    // -------------------------------------------------------------------------

    private String callVisionModel(String base64Image, String mimeType, String prompt) throws Exception {
        List<Object> content = List.of(
                Map.of("type", "text", "text", prompt),
                Map.of("type", "image_url",
                        "image_url", Map.of("url", "data:" + mimeType + ";base64," + base64Image))
        );

        Map<String, Object> body = Map.of(
                "model",       VISION_MODEL,
                "messages",    List.of(Map.of("role", "user", "content", content)),
                "temperature", 0.0,
                "max_tokens",  400
        );

        String json = mapper.writeValueAsString(body);

        boolean useBifrost = bifrostKey != null && !bifrostKey.isBlank()
                && !bifrostKey.startsWith("sk-bf-placeholder");

        HttpRequest request = useBifrost
                ? HttpRequest.newBuilder()
                    .uri(URI.create(bifrostBaseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("x-bf-vk", bifrostKey)
                    .header("x-git", "risk-ai-api")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build()
                : HttpRequest.newBuilder()
                    .uri(URI.create(OPENROUTER_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + openRouterApiKey)
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Vision API HTTP " + response.statusCode() + ": " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    // -------------------------------------------------------------------------
    // Parse AI JSON response
    // -------------------------------------------------------------------------

    private ValidationResult parseResult(String raw, String policyName, String policyId) {
        try {
            String cleaned = raw.replaceAll("```json", "").replaceAll("```", "").strip();
            JsonNode n = mapper.readTree(cleaned);

            return new ValidationResult(
                    n.path("isValid").asBoolean(false),
                    n.path("docType").asText("UNKNOWN"),
                    n.path("extractedName").asText(null).equals("null") ? null : n.path("extractedName").asText(null),
                    n.path("extractedId").asText(null).equals("null")   ? null : n.path("extractedId").asText(null),
                    n.path("dateOfDeath").asText(null).equals("null")   ? null : n.path("dateOfDeath").asText(null),
                    n.path("matchesPolicy").asBoolean(false),
                    n.path("feedback").asText("Document processed."),
                    n.path("qualityIssue").isNull() || n.path("qualityIssue").asText().equals("null")
                            ? null : n.path("qualityIssue").asText()
            );

        } catch (Exception e) {
            log.warn("[ClaimsValidator] Could not parse AI response: {}", raw);
            return new ValidationResult(
                    false, "UNKNOWN", null, null, null, false,
                    "Could not read document. Please upload a clearer image.", null);
        }
    }
}
