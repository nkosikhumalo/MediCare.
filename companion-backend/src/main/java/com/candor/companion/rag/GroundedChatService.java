package com.candor.companion.rag;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.candor.companion.domain.AuditLoggerService;
import com.candor.companion.domain.AuditLoggerService.AuditAction;
import com.candor.companion.domain.AuditLoggerService.AuditStatus;
import com.candor.companion.domain.CompanionRole;
import com.candor.companion.domain.SessionMemoryStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.SQLException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * GroundedChatService
 *
 * Orchestrates the full RAG → compliance-prompt → chat-completion pipeline:
 *
 *   1. Retrieve relevant chunks via RagRetrievalService.
 *   2. Short-circuit to fallback if no chunks clear the similarity threshold
 *      (never send an empty context to the model — avoid hallucination risk).
 *   3. Build the master compliance system prompt via CompliancePromptBuilder.
 *   4. Call the AI Gateway /chat/completions at temperature=0.0.
 *   5. Pass the raw LLM response through ComplianceGuardrailService before
 *      returning to the client.
 *
 * Uses the same gateway headers and retry pattern as GatewayEmbeddingClient
 * for consistency. Activate when rag.use-mock=false; the mock path returns
 * the context block directly so the dev loop doesn't require gateway creds.
 */
@Service
public class GroundedChatService {

    private static final Logger log = LoggerFactory.getLogger(GroundedChatService.class);
    private static final int MAX_RETRIES = 3;

    @Value("${ai.gateway.base-url}")
    private String baseUrl;

    @Value("${ai.gateway.virtual-key}")
    private String virtualKey;

    @Value("${ai.gateway.x-git}")
    private String xGit;

    // Gemini fallback — used when the gateway virtual key is unavailable
    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    // OpenRouter fallback — used when both Bifrost key and Gemini are unavailable
    @Value("${ai.openrouter.api-key:}")
    private String openRouterApiKey;

    @Value("${ai.openrouter.model:openai/gpt-4o-mini}")
    private String openRouterModel;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private static final String OPENROUTER_URL =
            "https://openrouter.ai/api/v1/chat/completions";

    private final RagRetrievalService retrievalService;
    private final CompliancePromptBuilder promptBuilder;
    private final ComplianceGuardrailService guardrailService;
    private final IntentGuardService intentGuard;
    private final RagProperties props;
    private final AuditLoggerService auditLogger;
    private final SessionMemoryStore memoryStore;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public GroundedChatService(
            RagRetrievalService retrievalService,
            CompliancePromptBuilder promptBuilder,
            ComplianceGuardrailService guardrailService,
            IntentGuardService intentGuard,
            RagProperties props,
            AuditLoggerService auditLogger,
            SessionMemoryStore memoryStore) {
        this.retrievalService = retrievalService;
        this.promptBuilder = promptBuilder;
        this.guardrailService = guardrailService;
        this.intentGuard = intentGuard;
        this.props = props;
        this.auditLogger = auditLogger;
        this.memoryStore = memoryStore;
    }

    /**
     * Full pipeline: retrieve → prompt → history → chat → guardrail → persist.
     *
     * @param userQuestion   The end-user's natural language query.
     * @param userId         Authenticated subject (for audit trail).
     * @param policyId       Policy in scope (for audit trail).
     * @param role           Effective role (for audit trail).
     * @param deceasedFlag   When true, activates Empathetic Claims Mode.
     * @param conversationId Stable ID for this chat thread — keys the memory store.
     * @return A grounded, compliance-validated answer string.
     */
    public String answer(String userQuestion, String userId, String policyId,
                         String role, boolean deceasedFlag, String conversationId) throws SQLException {

        // Step 0: Pre-LLM role-based intent gate — blocks BENEFICIARY from
        // what-if and policy-update intents before any tokens are consumed.
        CompanionRole effectiveRole;
        try {
            effectiveRole = CompanionRole.valueOf(role);
        } catch (IllegalArgumentException e) {
            effectiveRole = CompanionRole.POLICYHOLDER; // safe default
        }
        String blocked = intentGuard.checkAccess(userQuestion, effectiveRole, userId, policyId);
        if (blocked != null) {
            return blocked;
        }

        // Step 1: Retrieve grounded RAG context
        // When deceasedFlag is set, restrict to DEATH_CLAIMS chunks only —
        // the AI physically cannot see address-update or premium rules in this path.
        Optional<String> contextOpt = retrievalService.buildGroundedContext(userQuestion, deceasedFlag);
        String contextBlock = contextOpt.orElse(
                "No specific policy document context was retrieved for this query. " +
                "Answer the user's question using your general knowledge about Myriad life insurance products, " +
                "being clear that you are providing general information rather than details from their specific policy document. " +
                "Always recommend they contact a consultant for policy-specific details."
        );
        if (contextOpt.isEmpty()) {
            log.info("[GroundedChat] No chunks cleared threshold — proceeding without grounded context.");
        }

        // Step 2: Build system prompt (empathy layer + deceased-flag directive + compliance)
        if (deceasedFlag) {
            log.info("[GroundedChat] deceasedFlag=true — activating Empathetic Claims Mode for subject={}.", userId);
        }
        String systemPrompt = promptBuilder.build(contextBlock, deceasedFlag);

        // Step 3: Fetch conversation history from memory store — this is what keeps the
        // AI contextually aware across turns. History + new message are sent together so
        // the model never asks the user to repeat themselves.
        List<Map<String, String>> history = memoryStore.getHistory(conversationId);
        log.info("[GroundedChat] conversationId={} historyTurns={}", conversationId, history.size());

        // Step 4: Select provider and call with full context bundle
        String rawResponse;
        boolean hasBifrostKey = virtualKey != null && !virtualKey.isBlank()
                && !virtualKey.startsWith("sk-bf-placeholder")
                && !virtualKey.equals("sk-bf-68f57f84-7bf7-4c14-8fd1-4c277bf00ce");
        if (hasBifrostKey) {
            log.info("[GroundedChat] Using Bifrost gateway.");
            rawResponse = callChatCompletions(systemPrompt, userQuestion, history);
        } else if (openRouterApiKey != null && !openRouterApiKey.isBlank()) {
            log.info("[GroundedChat] Using OpenRouter fallback.");
            auditLogger.log(userId, policyId, role,
                    AuditAction.AI_PROVIDER_FALLBACK,
                    Map.of("provider", "openrouter", "reason", "bifrost_key_unavailable"));
            rawResponse = callOpenRouter(systemPrompt, userQuestion, history);
        } else if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            log.info("[GroundedChat] Using Gemini fallback.");
            auditLogger.log(userId, policyId, role,
                    AuditAction.AI_PROVIDER_FALLBACK,
                    Map.of("provider", "gemini", "reason", "bifrost_and_openrouter_unavailable"));
            rawResponse = callGemini(systemPrompt, userQuestion, history);
        } else {
            log.warn("[GroundedChat] No AI provider available — returning fallback.");
            auditLogger.log(userId, policyId, role,
                    AuditAction.AI_NO_PROVIDER,
                    Map.of("reason", "no_provider_configured"),
                    false, AuditStatus.HOLD_FOR_MANUAL_REVIEW);
            return props.getFallbackResponse();
        }

        // Step 5: Compliance guardrail check
        String answer = guardrailService.enforce(rawResponse, userId, policyId, role);

        // Step 6: Persist this turn so the next request has full context.
        // Both the user message and the (guardrail-checked) assistant reply are stored.
        memoryStore.append(conversationId, "user", userQuestion);
        memoryStore.append(conversationId, "assistant", answer);

        return answer;
    }

    /**
     * Overload for callers that have role context but no conversationId or deceased flag.
     */
    public String answer(String userQuestion, String userId, String policyId, String role,
                         boolean deceasedFlag) throws SQLException {
        return answer(userQuestion, userId, policyId, role, deceasedFlag,
                SessionMemoryStore.sessionKey(userId, policyId));
    }

    /**
     * Overload for callers with role context only — deceased flag defaults to false.
     */
    public String answer(String userQuestion, String userId, String policyId, String role) throws SQLException {
        return answer(userQuestion, userId, policyId, role, false,
                SessionMemoryStore.sessionKey(userId, policyId));
    }

    /**
     * Convenience overload for tests and smoke runs.
     */
    public String answer(String userQuestion) throws SQLException {
        return answer(userQuestion, "anonymous", "unknown", "unknown", false, "anon::unknown");
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private String callChatCompletions(String systemPrompt, String userQuestion,
                                        List<Map<String, String>> history) {
        int attempt = 0;
        long delayMs = 500;

        while (attempt < MAX_RETRIES) {
            try {
                // system prompt + full history + new user turn sent as one bundle
                List<Map<String, Object>> messages = buildMessages(systemPrompt, history, userQuestion);

                Map<String, Object> requestBody = Map.of(
                        "model", props.getChatModel(),
                        "messages", messages,
                        "temperature", 0.0
                );

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(baseUrl + "/chat/completions"))
                        .header("Content-Type", "application/json")
                        .header("x-git", xGit)
                        .header("x-bf-vk", virtualKey)
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    return root.path("choices").get(0).path("message").path("content").asText();
                }

                log.warn("[GroundedChat] Attempt {} — HTTP {}: {}", attempt + 1, response.statusCode(), response.body());

            } catch (Exception e) {
                log.warn("[GroundedChat] Attempt {} error: {}", attempt + 1, e.getMessage());
            }

            attempt++;
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) {}
            delayMs *= 2;
        }

        log.error("[GroundedChat] All {} attempts failed — returning fallback.", MAX_RETRIES);
        return props.getFallbackResponse();
    }

    private String callOpenRouter(String systemPrompt, String userQuestion,
                                   List<Map<String, String>> history) {
        int attempt = 0;
        long delayMs = 500;

        while (attempt < MAX_RETRIES) {
            try {
                List<Map<String, Object>> messages = buildMessages(systemPrompt, history, userQuestion);

                Map<String, Object> requestBody = Map.of(
                        "model", openRouterModel,
                        "messages", messages,
                        "temperature", 0.0
                );

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(OPENROUTER_URL))
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + openRouterApiKey)
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    return root.path("choices").get(0).path("message").path("content").asText();
                }

                log.warn("[GroundedChat/OpenRouter] Attempt {} — HTTP {}: {}", attempt + 1, response.statusCode(), response.body());

            } catch (Exception e) {
                log.warn("[GroundedChat/OpenRouter] Attempt {} error: {}", attempt + 1, e.getMessage());
            }

            attempt++;
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) {}
            delayMs *= 2;
        }

        log.error("[GroundedChat/OpenRouter] All {} attempts failed — returning fallback.", MAX_RETRIES);
        return props.getFallbackResponse();
    }

    private String callGemini(String systemPrompt, String userQuestion,
                               List<Map<String, String>> history) {
        int attempt = 0;
        long delayMs = 500;

        while (attempt < MAX_RETRIES) {
            try {
                // Gemini uses a contents array; map history turns then append the new user turn
                List<Map<String, Object>> contents = new ArrayList<>();
                for (Map<String, String> turn : history) {
                    String geminiRole = "assistant".equals(turn.get("role")) ? "model" : "user";
                    contents.add(Map.of(
                            "role", geminiRole,
                            "parts", List.of(Map.of("text", turn.get("content")))
                    ));
                }
                contents.add(Map.of("parts", List.of(Map.of("text", userQuestion))));

                Map<String, Object> requestBody = Map.of(
                        "system_instruction", Map.of(
                                "parts", List.of(Map.of("text", systemPrompt))
                        ),
                        "contents", contents,
                        "generationConfig", Map.of("temperature", 0.0)
                );

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(GEMINI_URL + geminiApiKey))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    return root.path("candidates").get(0)
                            .path("content").path("parts").get(0)
                            .path("text").asText();
                }

                log.warn("[GroundedChat/Gemini] Attempt {} — HTTP {}: {}", attempt + 1, response.statusCode(), response.body());

            } catch (Exception e) {
                log.warn("[GroundedChat/Gemini] Attempt {} error: {}", attempt + 1, e.getMessage());
            }

            attempt++;
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) {}
            delayMs *= 2;
        }

        log.error("[GroundedChat/Gemini] All {} attempts failed — returning fallback.", MAX_RETRIES);
        return props.getFallbackResponse();
    }

    /**
     * Builds the OpenAI-compatible messages array:
     *   [system] + [history turns...] + [new user turn]
     *
     * This is the exact bundle sent to the gateway on every request so the
     * model receives the full conversation context alongside the system prompt.
     */
    private List<Map<String, Object>> buildMessages(String systemPrompt,
                                                     List<Map<String, String>> history,
                                                     String userQuestion) {
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        for (Map<String, String> turn : history) {
            messages.add(Map.of("role", turn.get("role"), "content", turn.get("content")));
        }
        messages.add(Map.of("role", "user", "content", userQuestion));
        return messages;
    }
}
