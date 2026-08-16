package com.candor.companion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the companion backend (backend-for-frontend).
 * <p>
 * This service owns: end-user identity validation (mock JWT handoff from the
 * host app), role/deceased-flag derived authorization, session memory, and
 * — later, outside Core Journey 1 — the RAG, What-If, self-service, and
 * claims logic. It is the ONLY component that ever holds the AI Gateway's
 * machine (OAuth2 client-credentials) token; that token never crosses into
 * the browser and never touches the end-user identity token handled here.
 */
@SpringBootApplication
public class CompanionBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CompanionBackendApplication.class, args);
    }
}
