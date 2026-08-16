package com.candor.companion.rag;

/** A chunk fetched from storage together with its stored embedding vector. */
public record StoredChunk(long id, String section, String subsection, String content, float[] vector, String category) {
    /** Convenience constructor for callers that don't need the category (keyword retrieval, legacy). */
    public StoredChunk(long id, String section, String subsection, String content, float[] vector) {
        this(id, section, subsection, content, vector, PolicyChunk.CATEGORY_GENERAL);
    }
}
