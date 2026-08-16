package com.candor.companion.rag;

import java.util.List;
import java.util.Locale;

/**
 * A single chunk of policy text, ready to be embedded and stored.
 * Equivalent to the Python prototype's Chunk dataclass.
 *
 * The {@code category} field enables targeted retrieval: chunks that belong
 * to death-claim / estate sections are tagged DEATH_CLAIMS so that
 * Claims Mode queries skip 90% of the index and go directly to Section 4.
 */
public class PolicyChunk {

    /** Well-known category tags stored in the chunks table. */
    public static final String CATEGORY_DEATH_CLAIMS = "DEATH_CLAIMS";
    public static final String CATEGORY_GENERAL      = "GENERAL";

    // Section name fragments that map to DEATH_CLAIMS — checked case-insensitively.
    private static final List<String> DEATH_CLAIMS_KEYWORDS = List.of(
            "death claim", "death benefit", "death cover", "deceased",
            "estate", "beneficiary", "claimant", "dha-1663", "death certificate",
            "funeral", "posthumous", "estate late", "section 4", "claim requirements",
            "claim submission", "claim process", "claim document",
            "empathetic", "bereavement"
    );

    private final String section;
    private final String subsection;   // nullable
    private final String content;
    private final ChunkType chunkType;
    private final String effectiveDate; // nullable, e.g. "2025-11-01" for time-scoped clauses
    private final int tokenCount;
    private final String category;

    public PolicyChunk(String section, String subsection, String content) {
        this(section, subsection, content, ChunkType.PROSE, null);
    }

    public PolicyChunk(String section, String subsection, String content,
                        ChunkType chunkType, String effectiveDate) {
        this.section = section;
        this.subsection = subsection;
        this.content = content;
        this.chunkType = chunkType;
        this.effectiveDate = effectiveDate;
        this.tokenCount = content.trim().isEmpty() ? 0 : content.trim().split("\\s+").length;
        this.category = detectCategory(section, subsection, content);
    }

    /** Heuristically assigns DEATH_CLAIMS when any keyword appears in section, subsection, or content. */
    private static String detectCategory(String section, String subsection, String content) {
        String haystack = (
                (section != null ? section : "") + " " +
                (subsection != null ? subsection : "") + " " +
                content
        ).toLowerCase(Locale.ROOT);

        for (String kw : DEATH_CLAIMS_KEYWORDS) {
            if (haystack.contains(kw)) {
                return CATEGORY_DEATH_CLAIMS;
            }
        }
        return CATEGORY_GENERAL;
    }

    public String getSection()        { return section; }
    public String getSubsection()     { return subsection; }
    public String getContent()        { return content; }
    public ChunkType getChunkType()   { return chunkType; }
    public String getEffectiveDate()  { return effectiveDate; }
    public int getTokenCount()        { return tokenCount; }
    public String getCategory()       { return category; }
}
