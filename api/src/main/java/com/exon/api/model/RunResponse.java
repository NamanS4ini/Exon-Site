package com.exon.api.model;

import java.util.List;

/**
 * Response body for POST /api/run.
 */
public record RunResponse(
    boolean success,
    String output,
    List<ErrorDetail> errors,
    long executionTimeMs
) {

    /** Factory: successful execution. */
    public static RunResponse success(String output, long executionTimeMs) {
        return new RunResponse(true, output, List.of(), executionTimeMs);
    }

    /** Factory: failed execution with errors. */
    public static RunResponse failure(String output, List<ErrorDetail> errors, long executionTimeMs) {
        return new RunResponse(false, output, errors, executionTimeMs);
    }

    /** Factory: execution timed out. */
    public static RunResponse timeout(long executionTimeMs) {
        ErrorDetail err = new ErrorDetail(0, "Execution timed out after " + executionTimeMs + "ms.", "RUNTIME");
        return new RunResponse(false, "", List.of(err), executionTimeMs);
    }

    /** Factory: validation / request-level error. */
    public static RunResponse requestError(String message) {
        ErrorDetail err = new ErrorDetail(0, message, "RUNTIME");
        return new RunResponse(false, "", List.of(err), 0);
    }
}
