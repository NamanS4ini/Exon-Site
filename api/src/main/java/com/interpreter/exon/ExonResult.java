package com.interpreter.exon;

import java.util.Collections;
import java.util.List;

/**
 * Immutable result from a single ExonEngine.run() call.
 * Contains all output, all errors, and execution timing.
 */
public final class ExonResult {

    private final boolean success;
    private final String output;
    private final List<ExonError> errors;
    private final long executionTimeMs;

    private ExonResult(boolean success, String output, List<ExonError> errors, long executionTimeMs) {
        this.success = success;
        this.output = output;
        this.errors = Collections.unmodifiableList(errors);
        this.executionTimeMs = executionTimeMs;
    }

    /** Creates a successful result. */
    public static ExonResult success(String output, long executionTimeMs) {
        return new ExonResult(true, output, List.of(), executionTimeMs);
    }

    /** Creates a failed result, optionally including partial output produced before the error. */
    public static ExonResult failure(List<ExonError> errors, String partialOutput, long executionTimeMs) {
        return new ExonResult(false, partialOutput, errors, executionTimeMs);
    }

    /** Creates a timeout result. */
    public static ExonResult timeout(long executionTimeMs) {
        ExonError timeoutError = new ExonError(0, "Execution timed out after " + executionTimeMs + "ms.", ExonError.ErrorType.RUNTIME);
        return new ExonResult(false, "", List.of(timeoutError), executionTimeMs);
    }

    /** Creates an over-limit result. */
    public static ExonResult outputLimitExceeded(String partialOutput, long executionTimeMs) {
        ExonError limitError = new ExonError(0, "Output limit exceeded.", ExonError.ErrorType.RUNTIME);
        return new ExonResult(false, partialOutput, List.of(limitError), executionTimeMs);
    }

    public boolean isSuccess() { return success; }
    public String getOutput() { return output; }
    public List<ExonError> getErrors() { return errors; }
    public long getExecutionTimeMs() { return executionTimeMs; }

    @Override
    public String toString() {
        if (success) {
            return "ExonResult{success, output=" + output.length() + " chars, time=" + executionTimeMs + "ms}";
        }
        return "ExonResult{failure, errors=" + errors.size() + ", time=" + executionTimeMs + "ms}";
    }
}
