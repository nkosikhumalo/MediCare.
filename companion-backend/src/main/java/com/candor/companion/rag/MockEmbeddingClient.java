package com.candor.companion.rag;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Random;

/**
 * Deterministic mock so identical text always yields the identical vector
 * (useful for testing retrieval logic without real embeddings). Not
 * semantically meaningful — for wiring/plumbing tests only.
 *
 * Active by default (rag.use-mock=true, or unset). Set rag.use-mock=false
 * to switch to a real gateway-backed client instead — see the
 * GatewayEmbeddingClient note in this module's README for the Spring AI
 * wiring, which isn't shipped as a compiled class here to avoid depending
 * on a Spring AI dependency that may not yet be in this project's pom.xml.
 */
@Component
@ConditionalOnProperty(prefix = "rag", name = "use-mock", havingValue = "true", matchIfMissing = true)
public class MockEmbeddingClient implements EmbeddingClient {

    private final RagProperties props;

    public MockEmbeddingClient(RagProperties props) {
        this.props = props;
    }

    @Override
    public float[] embed(String text) {
        long seed = text.hashCode();
        Random rng = new Random(seed);
        float[] vector = new float[props.getEmbeddingDims()];
        for (int i = 0; i < vector.length; i++) {
            vector[i] = (float) rng.nextGaussian();
        }
        return vector;
    }
}
