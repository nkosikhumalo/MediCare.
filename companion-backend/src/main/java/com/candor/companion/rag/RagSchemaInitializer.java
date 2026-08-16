package com.candor.companion.rag;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Creates the SQLite schema on startup if it doesn't already exist.
 *
 * Design note (belongs in SUBMISSION.md too): SQLite is chosen for the
 * virtual phase because there is no managed vector-store service (per the
 * AI Gateway docs, Vector Store API is roadmap-only) and the corpus this
 * week is a single sample document. Vectors are stored as raw bytes
 * (float array serialized via ByteBuffer) rather than JSON text — smaller
 * on disk, avoids parse overhead — with similarity computed in
 * application code rather than in-database. At Finals, with a larger real
 * policy corpus, this swaps for pgvector (already shown in the gateway's
 * Spring AI config) to get indexed ANN search instead of a full scan.
 *
 * NOTE: uses jakarta.annotation.PostConstruct (Spring Boot 3.x / Jakarta EE).
 * If this project is on Spring Boot 2.x, swap the import to
 * javax.annotation.PostConstruct instead.
 */
@Component
public class RagSchemaInitializer {

    private static final String[] SCHEMA_STATEMENTS = {
        """
        CREATE TABLE IF NOT EXISTS documents (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            filename    TEXT NOT NULL,
            version     TEXT,
            ingested_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS chunks (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id    INTEGER NOT NULL REFERENCES documents(id),
            section        TEXT NOT NULL,
            subsection     TEXT,
            chunk_type     TEXT NOT NULL DEFAULT 'PROSE',
            content        TEXT NOT NULL,
            effective_date TEXT,
            token_count    INTEGER,
            category       TEXT NOT NULL DEFAULT 'GENERAL',
            created_at     TEXT NOT NULL DEFAULT (datetime('now'))
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS embeddings (
            chunk_id   INTEGER PRIMARY KEY REFERENCES chunks(id),
            model      TEXT NOT NULL,
            dims       INTEGER NOT NULL,
            vector     BLOB NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
        """,
        "CREATE INDEX IF NOT EXISTS idx_chunks_section   ON chunks(section)",
        "CREATE INDEX IF NOT EXISTS idx_chunks_category  ON chunks(category)",
        // Persistent conversation memory — survives server restarts.
        // conversation_id is the client-supplied opaque string key.
        // role is "user" or "assistant", matching the OpenAI messages format.
        """
        CREATE TABLE IF NOT EXISTS conversation_messages (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL,
            role            TEXT NOT NULL,
            content         TEXT NOT NULL,
            created_at      TEXT NOT NULL DEFAULT (datetime('now'))
        )
        """,
        "CREATE INDEX IF NOT EXISTS idx_conv_messages_conv ON conversation_messages(conversation_id, id)"
    };

    private final SqliteConnectionProvider connectionProvider;

    public RagSchemaInitializer(SqliteConnectionProvider connectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    @PostConstruct
    public void init() {
        try (Connection conn = connectionProvider.getConnection();
             Statement stmt = conn.createStatement()) {

            // Run migration FIRST so the category column exists before the
            // index on chunks(category) is created below.
            try {
                stmt.execute("ALTER TABLE chunks ADD COLUMN category TEXT NOT NULL DEFAULT 'GENERAL'");
            } catch (SQLException ignored) {
                // Column already exists — safe to ignore
            }

            for (String ddl : SCHEMA_STATEMENTS) {
                stmt.execute(ddl);
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to initialize RAG schema", e);
        }
    }
}
