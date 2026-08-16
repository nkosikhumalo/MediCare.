package com.candor.companion.domain;

import com.candor.companion.rag.SqliteConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * SessionMemoryStore — persistent conversation memory backed by SQLite.
 *
 * Every user/assistant turn is written to the conversation_messages table
 * (created by RagSchemaInitializer). History survives server restarts and
 * is loaded fresh from disk on every getHistory() call, so a user who
 * returns the next day picks up exactly where they left off.
 *
 * The public API is identical to the previous in-memory version so no
 * call sites outside this class needed to change.
 *
 * Sliding window: only the last DEFAULT_WINDOW turns are returned to the
 * LLM to keep token usage bounded. Older turns stay in the DB (audit trail)
 * but are not sent to the model.
 *
 * Thread safety: SQLite handles concurrent reads fine; writes are
 * serialised by the JDBC driver. No additional locking needed here.
 */
@Component
public class SessionMemoryStore {

    private static final Logger log = LoggerFactory.getLogger(SessionMemoryStore.class);
    private static final int DEFAULT_WINDOW = 20;

    private final SqliteConnectionProvider db;

    public SessionMemoryStore(SqliteConnectionProvider db) {
        this.db = db;
    }

    /**
     * Builds a session key scoped to the user + policy so sessions can't
     * cross-contaminate between different policyholders or beneficiaries.
     */
    public static String sessionKey(String subject, String policyId) {
        return subject + "::" + policyId;
    }

    /**
     * Persists a single turn to the database.
     *
     * @param conversationId the opaque conversation key
     * @param role           "user" or "assistant"
     * @param content        the message text
     */
    public void append(String conversationId, String role, String content) {
        String sql = "INSERT INTO conversation_messages (conversation_id, role, content) VALUES (?, ?, ?)";
        try (Connection conn = db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, conversationId);
            ps.setString(2, role);
            ps.setString(3, content);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("[SessionMemory] Failed to persist turn conversationId={} role={}: {}",
                    conversationId, role, e.getMessage());
        }
    }

    /**
     * Loads the last DEFAULT_WINDOW turns for the conversation from the
     * database, ordered oldest-first, ready to drop directly into the
     * OpenAI messages array.
     *
     * Because this reads from SQLite on every call the AI always has the
     * real persisted history — not a heap copy that disappears on restart.
     */
    public List<Map<String, String>> getHistory(String conversationId) {
        // Sub-query grabs the most recent N rows; outer query re-orders them oldest-first
        String sql = """
                SELECT role, content FROM (
                    SELECT id, role, content
                    FROM conversation_messages
                    WHERE conversation_id = ?
                    ORDER BY id DESC
                    LIMIT ?
                ) ORDER BY id ASC
                """;
        List<Map<String, String>> history = new ArrayList<>();
        try (Connection conn = db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, conversationId);
            ps.setInt(2, DEFAULT_WINDOW);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    history.add(Map.of(
                            "role", rs.getString("role"),
                            "content", rs.getString("content")
                    ));
                }
            }
        } catch (SQLException e) {
            log.error("[SessionMemory] Failed to load history conversationId={}: {}",
                    conversationId, e.getMessage());
        }
        return history;
    }

    /**
     * Deletes all messages for a conversation — called on explicit reset or logout.
     * Does not affect other conversations.
     */
    public void clear(String conversationId) {
        String sql = "DELETE FROM conversation_messages WHERE conversation_id = ?";
        try (Connection conn = db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, conversationId);
            int deleted = ps.executeUpdate();
            log.info("[SessionMemory] Cleared {} turns for conversationId={}", deleted, conversationId);
        } catch (SQLException e) {
            log.error("[SessionMemory] Failed to clear conversationId={}: {}",
                    conversationId, e.getMessage());
        }
    }
}
