package com.candor.companion.rag;

/**
 * Abstraction over "turn text into a vector," so the rest of the RAG
 * pipeline doesn't care whether it's talking to a mock or the real
 * AI Gateway embeddings endpoint.
 */
public interface EmbeddingClient {
    float[] embed(String text);
}
