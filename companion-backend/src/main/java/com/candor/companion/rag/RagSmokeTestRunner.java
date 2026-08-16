package com.candor.companion.rag;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Minimal smoke test using hand-built chunks, since the real PDF
 * structural splitter (PolicyChunker.splitIntoSections) is a stub.
 *
 * Off by default. Enable with rag.smoke-test=true to run it once on
 * startup and confirm the ingest -> retrieve pipeline is wired correctly.
 * With mock embeddings (random per-text vectors), the sample query below
 * won't clear the similarity threshold — you'll see the fallback response
 * printed. That's expected and correct: it's proof the threshold guard
 * blocks weak matches rather than passing them to the chat model.
 */
@Component
@ConditionalOnProperty(prefix = "rag", name = "smoke-test", havingValue = "true")
public class RagSmokeTestRunner implements CommandLineRunner {

    private final RagIngestionService ingestionService;
    private final RagRetrievalService retrievalService;
    private final RagProperties props;

    public RagSmokeTestRunner(RagIngestionService ingestionService,
                               RagRetrievalService retrievalService,
                               RagProperties props) {
        this.ingestionService = ingestionService;
        this.retrievalService = retrievalService;
        this.props = props;
    }

    @Override
    public void run(String... args) throws Exception {
        List<PolicyChunk> sampleChunks = List.of(
                new PolicyChunk("Fees", null,
                        "The contract policy fee is R30 per month..."),
                new PolicyChunk("Lapses and reinstatements", "Premiums in arrears (Lapse)",
                        "A 30-day grace period will apply...")
        );
        ingestionService.ingestDocument("Policy_Guide_Sample_Extract.pdf", "February 2024", sampleChunks);

        Optional<String> context = retrievalService.buildGroundedContext("How long is the cooling-off period?");
        System.out.println("[RAG smoke test] " + context.orElse(props.getFallbackResponse()));
    }
}
