package com.interpreter.exon;

/**
 * Collects all standard output produced by 'out' statements during a run.
 * Replaces direct System.out.println() calls, enabling output capture for
 * the web API and enforcing output limits to prevent runaway programs.
 */
public class OutputCollector {

    private final StringBuilder buffer = new StringBuilder();
    private final int maxLines;
    private int lineCount = 0;

    public OutputCollector(int maxLines) {
        this.maxLines = maxLines;
    }

    /** Default constructor with a generous but safe limit. */
    public OutputCollector() {
        this(1000);
    }

    /**
     * Appends a line to the output buffer.
     * Throws OutputLimitExceededException when the limit is reached.
     */
    public void println(String value) {
        if (lineCount >= maxLines) {
            throw new OutputLimitExceededException(
                "Output limit of " + maxLines + " lines exceeded."
            );
        }
        buffer.append(value).append("\n");
        lineCount++;
    }

    /** Returns the full collected output. */
    public String getOutput() {
        return buffer.toString();
    }

    /** Returns how many lines have been written. */
    public int getLineCount() {
        return lineCount;
    }

    /** Exception thrown when the output line limit is exceeded. */
    public static class OutputLimitExceededException extends RuntimeException {
        public OutputLimitExceededException(String message) {
            super(message);
        }
    }
}
