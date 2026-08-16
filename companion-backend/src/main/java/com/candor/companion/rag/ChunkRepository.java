package com.candor.companion.rag;

import org.springframework.stereotype.Repository;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Raw JDBC access to the SQLite schema. Vectors are stored as BLOBs
 * (float32 little-endian, matching how they're read back) rather than as
 * JSON text — see RagSchemaInitializer for the trade-off note.
 */
@Repository
public class ChunkRepository {

    private final SqliteConnectionProvider connectionProvider;
    private final RagProperties props;

    public ChunkRepository(SqliteConnectionProvider connectionProvider, RagProperties props) {
        this.connectionProvider = connectionProvider;
        this.props = props;
    }

    public boolean documentExists(String filename, String version) throws SQLException {
        String sql = "SELECT COUNT(*) FROM documents WHERE filename = ? AND version = ?";
        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, filename);
            ps.setString(2, version);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    public long insertDocument(String filename, String version) throws SQLException {        String sql = "INSERT INTO documents (filename, version) VALUES (?, ?)";
        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, filename);
            ps.setString(2, version);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                return keys.getLong(1);
            }
        }
    }

    public long insertChunk(long documentId, PolicyChunk chunk) throws SQLException {
        String sql = """
            INSERT INTO chunks
                (document_id, section, subsection, chunk_type, content, effective_date, token_count, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, documentId);
            ps.setString(2, chunk.getSection());
            ps.setString(3, chunk.getSubsection());
            ps.setString(4, chunk.getChunkType().name());
            ps.setString(5, chunk.getContent());
            ps.setString(6, chunk.getEffectiveDate());
            ps.setInt(7, chunk.getTokenCount());
            ps.setString(8, chunk.getCategory());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                return keys.getLong(1);
            }
        }
    }

    public void insertEmbedding(long chunkId, float[] vector) throws SQLException {
        String sql = "INSERT INTO embeddings (chunk_id, model, dims, vector) VALUES (?, ?, ?, ?)";
        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, chunkId);
            ps.setString(2, props.getEmbeddingModel());
            ps.setInt(3, vector.length);
            ps.setBytes(4, toBytes(vector));
            ps.executeUpdate();
        }
    }

    public List<StoredChunk> fetchAllWithEmbeddings() throws SQLException {
        String sql = """
            SELECT c.id, c.section, c.subsection, c.content, c.category, e.vector, e.dims
            FROM chunks c
            JOIN embeddings e ON e.chunk_id = c.id
            """;
        List<StoredChunk> results = new ArrayList<>();
        try (Connection conn = connectionProvider.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                float[] vector = fromBytes(rs.getBytes("vector"), rs.getInt("dims"));
                results.add(new StoredChunk(
                        rs.getLong("id"),
                        rs.getString("section"),
                        rs.getString("subsection"),
                        rs.getString("content"),
                        vector,
                        rs.getString("category")));
            }
        }
        return results;
    }

    /**
     * Fetches embeddings filtered by category — used in Claims Mode to restrict
     * cosine search strictly to DEATH_CLAIMS chunks, skipping all other sections.
     */
    public List<StoredChunk> fetchWithEmbeddingsByCategory(String category) throws SQLException {
        String sql = """
            SELECT c.id, c.section, c.subsection, c.content, c.category, e.vector, e.dims
            FROM chunks c
            JOIN embeddings e ON e.chunk_id = c.id
            WHERE c.category = ?
            """;
        List<StoredChunk> results = new ArrayList<>();
        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    float[] vector = fromBytes(rs.getBytes("vector"), rs.getInt("dims"));
                    results.add(new StoredChunk(
                            rs.getLong("id"),
                            rs.getString("section"),
                            rs.getString("subsection"),
                            rs.getString("content"),
                            vector,
                            rs.getString("category")));
                }
            }
        }
        return results;
    }

    /**
     * Keyword-based retrieval — used when mock embeddings are active.
     * Searches chunk content and section names using SQLite LIKE, returns
     * topK results. Much faster than loading all 23k vectors into memory.
     * Excludes TOC noise (dotted lines, underscores) and short fragments.
     */
    public List<StoredChunk> fetchByKeyword(String query, int topK) throws SQLException {
        return fetchByKeywordInternal(query, topK, null);
    }

    /**
     * Same as {@link #fetchByKeyword} but restricted to a specific category.
     * Used in Claims Mode (mock path) to skip non-death-claim chunks entirely.
     */
    public List<StoredChunk> fetchByKeywordAndCategory(String query, int topK, String category) throws SQLException {
        return fetchByKeywordInternal(query, topK, category);
    }

    private List<StoredChunk> fetchByKeywordInternal(String query, int topK, String category) throws SQLException {
        List<String> terms = expandSearchTerms(query);
        if (terms.isEmpty()) return List.of();

        // TOC noise filter: only drop SHORT separator-heavy fragments.
        // Real fee/premium sections embed "______" heading separators inside longer
        // body text — those must remain searchable.
        StringBuilder sql = new StringBuilder("""
            SELECT c.id, c.section, c.subsection, c.content,
                   (
            """);

        for (int i = 0; i < terms.size(); i++) {
            if (i > 0) sql.append(" + ");
            sql.append("""
                CASE WHEN LOWER(c.content) LIKE ? OR LOWER(c.section) LIKE ? THEN 1 ELSE 0 END
                """);
        }

        sql.append("""
                   ) AS hit_score
            FROM chunks c
            WHERE length(c.content) > 100
              AND NOT (
                    length(c.content) < 280
                    AND (c.content LIKE '%.......%' OR c.content LIKE '%______%')
              )
            """);

        if (category != null) {
            sql.append("  AND c.category = ?\n");
        }

        sql.append("  AND (\n");
        for (int i = 0; i < terms.size(); i++) {
            if (i > 0) sql.append(" OR ");
            sql.append("LOWER(c.content) LIKE ? OR LOWER(c.section) LIKE ?");
        }
        sql.append(") ORDER BY hit_score DESC, length(c.content) ASC LIMIT ?");

        try (Connection conn = connectionProvider.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            int param = 1;

            // hit_score CASE params
            for (String term : terms) {
                String like = "%" + term + "%";
                ps.setString(param++, like);
                ps.setString(param++, like);
            }

            if (category != null) {
                ps.setString(param++, category);
            }

            // WHERE LIKE params
            for (String term : terms) {
                String like = "%" + term + "%";
                ps.setString(param++, like);
                ps.setString(param++, like);
            }
            ps.setInt(param, topK);

            List<StoredChunk> results = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    results.add(new StoredChunk(
                            rs.getLong("id"),
                            rs.getString("section"),
                            rs.getString("subsection"),
                            rs.getString("content"),
                            new float[0]));
                }
            }
            return results;
        }
    }

    /**
     * Builds searchable terms from a user question: drops stop words and expands
     * pricing synonyms so "policy prices" can hit "premium" / "fee" chunks.
     */
    static List<String> expandSearchTerms(String query) {
        Set<String> stop = Set.of(
                "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
                "of", "to", "in", "on", "for", "with", "about", "from", "by", "as",
                "at", "or", "and", "but", "if", "then", "so", "do", "does", "did",
                "can", "could", "would", "should", "will", "just", "any", "my", "your",
                "our", "their", "this", "that", "these", "those", "what", "which",
                "who", "how", "much", "many", "me", "please", "tell", "give", "show",
                "i", "you", "it", "its"
        );

        Map<String, List<String>> synonyms = Map.ofEntries(
                Map.entry("price", List.of("premium", "fee", "cost")),
                Map.entry("prices", List.of("premium", "fee", "cost")),
                Map.entry("pricing", List.of("premium", "fee", "cost")),
                Map.entry("cost", List.of("premium", "fee")),
                Map.entry("costs", List.of("premium", "fee")),
                Map.entry("expensive", List.of("premium", "fee")),
                Map.entry("cheap", List.of("premium", "fee", "discount")),
                Map.entry("amount", List.of("premium", "fee", "benefit")),
                Map.entry("monthly", List.of("month", "premium", "fee")),
                Map.entry("start", List.of("minimum", "premium")),
                Map.entry("starting", List.of("minimum", "premium"))
        );

        LinkedHashSet<String> terms = new LinkedHashSet<>();
        String[] words = query.toLowerCase().replaceAll("[^a-z0-9 ]", " ").trim().split("\\s+");
        for (String word : words) {
            if (word.isBlank() || word.length() < 2 || stop.contains(word)) continue;
            terms.add(word);
            List<String> syns = synonyms.get(word);
            if (syns != null) terms.addAll(syns);
        }

        // Always bias fee/premium retrieval for money-ish questions
        String lower = query.toLowerCase();
        if (lower.contains("price") || lower.contains("cost") || lower.contains("fee")
                || lower.contains("premium") || lower.contains("how much")
                || lower.contains("rand") || lower.matches(".*\\br\\d+.*")) {
            terms.add("premium");
            terms.add("fee");
            terms.add("minimum");
        }

        return new ArrayList<>(terms);
    }

    private byte[] toBytes(float[] vector) {
        ByteBuffer buffer = ByteBuffer.allocate(vector.length * 4).order(ByteOrder.LITTLE_ENDIAN);
        for (float f : vector) {
            buffer.putFloat(f);
        }
        return buffer.array();
    }

    private float[] fromBytes(byte[] bytes, int dims) {
        ByteBuffer buffer = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        float[] vector = new float[dims];
        for (int i = 0; i < dims; i++) {
            vector[i] = buffer.getFloat();
        }
        return vector;
    }
}
