package com.interpreter.exon;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Collects all diagnostic errors during a single interpreter run.
 * Replaces the static hadError / hadRuntimeError flags in Exon.java,
 * making the interpreter safe for concurrent web requests.
 */
public class ErrorCollector {

    private final List<ExonError> errors = new ArrayList<>();

    /** Returns true if any error has been recorded. */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /** Returns an unmodifiable view of all collected errors. */
    public List<ExonError> getErrors() {
        return Collections.unmodifiableList(errors);
    }

    /** Records a scan-phase error. */
    public void scanError(int line, String message) {
        errors.add(new ExonError(line, message, ExonError.ErrorType.SCAN));
    }

    /** Records a parse-phase error at a specific token. */
    public void parseError(Token token, String message) {
        if (token.type == TokenType.EOF) {
            errors.add(new ExonError(token.line, "at end: " + message, ExonError.ErrorType.PARSE));
        } else {
            errors.add(new ExonError(token.line, "at '" + token.lexeme + "': " + message, ExonError.ErrorType.PARSE));
        }
    }

    /** Records a resolution-phase (static semantic) error at a specific token. */
    public void resolveError(Token token, String message) {
        if (token.type == TokenType.EOF) {
            errors.add(new ExonError(token.line, "at end: " + message, ExonError.ErrorType.RESOLUTION));
        } else {
            errors.add(new ExonError(token.line, "at '" + token.lexeme + "': " + message, ExonError.ErrorType.RESOLUTION));
        }
    }

    /** Records a resolution-phase error at a line number only. */
    public void resolveError(int line, String message) {
        errors.add(new ExonError(line, message, ExonError.ErrorType.RESOLUTION));
    }

    /** Records a runtime error. */
    public void runtimeError(RuntimeError error) {
        errors.add(ExonError.runtimeError(error.token.line, error.getMessage()));
    }
}
