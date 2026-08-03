package com.exon.api.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for POST /api/run.
 */
public record RunRequest(
    @NotBlank(message = "Source code must not be blank.")
    @Size(max = 10_000, message = "Source code must not exceed 10,000 characters.")
    String source
) {}
