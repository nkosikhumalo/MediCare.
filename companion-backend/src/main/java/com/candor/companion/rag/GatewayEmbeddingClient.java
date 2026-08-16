package com.candor.companion.rag;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * GatewayEmbeddingClient
 *
 * Live EmbeddingClient that calls the AI Gateway embeddings endpoint.
 * Replaces MockEmbeddingClient when rag.use-mock=false in application.properties.
 *
 * Uses the exact headers required by the gateway:
 *   - x-git: identifies the integration (risk-ai-api)
 *   - x-bf-vk: the virtual key (never committed — injected via env var)
 *
 * Includes exponential backoff retry (up to 3 attempts) to handle Bedrock
 * rate-limits or transient gateway failures gracefully.
 *
 * Active when: rag.use-mock=false
 */
@Component
@ConditionalOnProperty(prefix = "rag", name = "use-mock", havingValue = "false")
public class GatewayEmbeddingClient implements EmbeddingClient {

    private static final Logger log = LoggerFactory.getLogger(GatewayEmbeddingClient.class);
    private static final int MAX_RETRIES = 3;

    @Value("${ai.gateway.base-url}")
    private String baseUrl;

    @Value("${ai.gateway.virtual-key}")
    private String virtualKey;

    @Value("${ai.gateway.x-git}")
    private String xGit;

    private final RagProperties props;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public GatewayEmbeddingClient(RagProperties props) {
        this.props = props;
    }

    @Override
    public float[] embed(String text) {
        int attempt = 0;
        long delayMs = 500;

        while (attempt < MAX_RETRIES) {
            try {
                String payload = objectMapper.writeValueAsString(Map.of(
                        "model", props.getEmbeddingModel(),
                        "input", List.of(text),
                        "encoding_format", "float"
                ));

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(baseUrl + "/embeddings"))
                        .header("Content-Type", "application/json")
                        .header("x-git", xGit)
                        .header("x-bf-vk", virtualKey)
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode embeddingNode = root.path("data").get(0).path("embedding");
                    float[] vector = new float[props.getEmbeddingDims()];
                    int i = 0;
                    for (JsonNode val : embeddingNode) {
                        if (i >= vector.length) break;
                        vector[i++] = val.floatValue();
                    }
                    return vector;
                }

                log.warn("[Embedding] Attempt {} failed — HTTP {}", attempt + 1, response.statusCode());

            } catch (Exception e) {
                log.warn("[Embedding] Attempt {} error: {}", attempt + 1, e.getMessage());
            }

            attempt++;
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) {}
            delayMs *= 2; // exponential backoff
        }

        log.error("[Embedding] All {} attempts failed. Returning zero vector.", MAX_RETRIES);
        return new float[props.getEmbeddingDims()];
    }
}
