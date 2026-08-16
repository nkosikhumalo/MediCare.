package com.candor.companion.selfservice;

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
 * Uses a vision-capable LLM to extract the address from a proof-of-residence
 * document (photo or PDF-rendered image) and compare it against the address
 * the user typed in.
 *
 * Match logic is intentionally lenient on formatting (normalises whitespace,
 * case, punctuation) but strict on the three fields that matter most:
 * street address, city, and province. Postal code is checked when present.
 *
 * Falls back to OpenRouter (gpt-4o-mini vision) when the Bifrost key is absent,
 * matching the same cascade used by GroundedChatService.
 */
@Service
public class ProofOfResidenceVerifier {

    private static final Logger log = LoggerFactory.getLogger(ProofOfResidenceVerifier.class);

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String VISION_MODEL    = "openai/gpt-4o-mini";

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

    public record VerificationResult(boolean matched, String extractedAddress, String reason) {}

    /**
     * @param imageBytes  raw bytes of the uploaded document (JPEG / PNG / PDF page)
     * @param mimeType    e.g. "image/jpeg", "image/png"
     * @param submitted   the address the user typed in
     */
    public VerificationResult verify(byte[] imageBytes, String mimeType,
                                     AddressUpdateRequest submitted) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String extractionPrompt = buildExtractionPrompt(submitted);

            String raw = callVisionModel(base64Image, mimeType, extractionPrompt);
            log.info("[PoR] AI extracted: {}", raw);

            return compare(raw, submitted);

        } catch (Exception e) {
            log.error("[PoR] Verification failed: {}", e.getMessage());
            // On unexpected error, do not auto-approve — surface as mismatch
            return new VerificationResult(false, "ERROR", "Verification service error: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Prompt
    // -------------------------------------------------------------------------

    private String buildExtractionPrompt(AddressUpdateRequest submitted) {
        return """
                You are an address extraction assistant. The user has uploaded a proof-of-residence document.
                Extract ONLY the physical address from the document and return it as a JSON object with these exact keys:
                  streetAddress, suburb, city, province, postalCode
                If a field is not visible in the document, set its value to an empty string.
                Return ONLY the JSON object — no explanation, no markdown, no extra text.

                The user claims their address is:
                  Street : %s
                  Suburb : %s
                  City   : %s
                  Province: %s
                  Postal  : %s
                """.formatted(
                submitted.streetAddress(),
                submitted.suburb() != null ? submitted.suburb() : "",
                submitted.city(),
                submitted.province(),
                submitted.postalCode() != null ? submitted.postalCode() : ""
        );
    }

    // -------------------------------------------------------------------------
    // Vision API call (OpenRouter → Bifrost cascade)
    // -------------------------------------------------------------------------

    private String callVisionModel(String base64Image, String mimeType, String prompt) throws Exception {
        List<Object> contentParts = List.of(
                Map.of("type", "text", "text", prompt),
                Map.of("type", "image_url",
                        "image_url", Map.of("url", "data:" + mimeType + ";base64," + base64Image))
        );

        Map<String, Object> body = Map.of(
                "model", VISION_MODEL,
                "messages", List.of(Map.of("role", "user", "content", contentParts)),
                "temperature", 0.0,
                "max_tokens", 300
        );

        String json = mapper.writeValueAsString(body);

        boolean useBifrost = bifrostKey != null && !bifrostKey.isBlank()
                && !bifrostKey.startsWith("sk-bf-placeholder");

        HttpRequest request;
        if (useBifrost) {
            request = HttpRequest.newBuilder()
                    .uri(URI.create(bifrostBaseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("x-bf-vk", bifrostKey)
                    .header("x-git", "risk-ai-api")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
        } else {
            request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENROUTER_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + openRouterApiKey)
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
        }

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Vision API returned HTTP " + response.statusCode() + ": " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    // -------------------------------------------------------------------------
    // Address comparison
    // -------------------------------------------------------------------------

    private VerificationResult compare(String aiResponse, AddressUpdateRequest submitted) {
        try {
            // Strip markdown code fences if the model wrapped the JSON
            String cleaned = aiResponse.replaceAll("```json", "").replaceAll("```", "").strip();
            JsonNode extracted = mapper.readTree(cleaned);

            String docStreet   = normalise(extracted.path("streetAddress").asText());
            String docCity     = normalise(extracted.path("city").asText());
            String docProvince = normalise(extracted.path("province").asText());
            String docPostal   = normalise(extracted.path("postalCode").asText());

            String subStreet   = normalise(submitted.streetAddress());
            String subCity     = normalise(submitted.city());
            String subProvince = normalise(submitted.province());
            String subPostal   = normalise(submitted.postalCode() != null ? submitted.postalCode() : "");

            // Province and city must match exactly (after normalisation).
            // Street is checked with contains() to tolerate "45 Oak St" vs "45 Oak Street".
            boolean provinceMatch = docProvince.equals(subProvince);
            boolean cityMatch     = docCity.equals(subCity);
            boolean streetMatch   = docStreet.contains(subStreet) || subStreet.contains(docStreet);
            boolean postalMatch   = subPostal.isEmpty() || docPostal.isEmpty() || docPostal.equals(subPostal);

            boolean matched = provinceMatch && cityMatch && streetMatch && postalMatch;

            String extractedFormatted = "%s, %s, %s, %s".formatted(
                    extracted.path("streetAddress").asText(),
                    extracted.path("city").asText(),
                    extracted.path("province").asText(),
                    extracted.path("postalCode").asText());

            String reason = matched
                    ? "Document address matches submitted address."
                    : buildMismatchReason(provinceMatch, cityMatch, streetMatch, postalMatch);

            return new VerificationResult(matched, extractedFormatted, reason);

        } catch (Exception e) {
            log.warn("[PoR] Could not parse AI JSON response: {}", aiResponse);
            return new VerificationResult(false, aiResponse,
                    "Could not parse address from document. Please upload a clearer image.");
        }
    }

    private String buildMismatchReason(boolean province, boolean city, boolean street, boolean postal) {
        StringBuilder sb = new StringBuilder("Address mismatch — ");
        if (!province) sb.append("province does not match; ");
        if (!city)     sb.append("city does not match; ");
        if (!street)   sb.append("street address does not match; ");
        if (!postal)   sb.append("postal code does not match; ");
        return sb.toString().stripTrailing().replaceAll(";$", ".");
    }

    private String normalise(String value) {
        if (value == null) return "";
        return value.toLowerCase()
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .strip();
    }
}
