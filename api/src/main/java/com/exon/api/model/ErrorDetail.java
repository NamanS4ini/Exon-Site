package com.exon.api.model;

/**
 * A single diagnostic error returned in a RunResponse.
 */
public record ErrorDetail(
    int line,
    String message,
    String type   // "SCAN", "PARSE", "RESOLUTION", "RUNTIME"
) {}
