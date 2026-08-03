package com.exon.api.model;

/**
 * A named Exon example program available via GET /api/examples.
 */
public record ExampleProgram(
    String id,
    String name,
    String description,
    String code
) {}
