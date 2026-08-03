package com.interpreter.exon;

/**
 * Represents a single diagnostic error from the Exon interpreter.
 * This is a lightweight, serialization-friendly record used by the API.
 */
public record ExonError(
    int line,
    String message,
    ErrorType type
) {
    public enum ErrorType {
        SCAN,       // Lexical error (unexpected character, unterminated string)
        PARSE,      // Syntax error (malformed grammar)
        RESOLUTION, // Static semantic error (invalid this/super, duplicate locals)
        RUNTIME     // Runtime error (type mismatch, undefined property)
    }

    /** Convenience factory for scan/parse/resolution errors. */
    public static ExonError staticError(int line, String message, ErrorType type) {
        return new ExonError(line, message, type);
    }

    /** Convenience factory for runtime errors. */
    public static ExonError runtimeError(int line, String message) {
        return new ExonError(line, message, ErrorType.RUNTIME);
    }

    @Override
    public String toString() {
        return "[line " + line + "] " + type + ": " + message;
    }
}
