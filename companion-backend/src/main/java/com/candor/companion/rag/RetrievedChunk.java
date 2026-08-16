package com.candor.companion.rag;

/** A chunk that cleared the similarity threshold, with its score against the query. */
public record RetrievedChunk(long chunkId, String section, String subsection, String content, double similarity) {}
