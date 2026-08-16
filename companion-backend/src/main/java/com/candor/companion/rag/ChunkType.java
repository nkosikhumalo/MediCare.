package com.candor.companion.rag;

/** 'prose' | 'table' — tables are kept atomic and never fixed-size sub-split. */
public enum ChunkType {
    PROSE,
    TABLE
}
