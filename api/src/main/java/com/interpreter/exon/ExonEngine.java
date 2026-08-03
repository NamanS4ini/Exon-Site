package com.interpreter.exon;

import java.util.List;

/**
 * Public entry point for executing Exon source code programmatically.
 *
 * <p>This class replaces the static methods in {@link Exon} for all use cases
 * that need to capture output or errors, such as a web API or test harness.
 * Each call to {@link #run} creates completely isolated state, making it
 * safe for concurrent use from multiple threads.</p>
 *
 * <pre>
 *   ExonResult result = ExonEngine.run("out 1 + 2;");
 *   System.out.println(result.getOutput()); // "3\n"
 * </pre>
 */
public class ExonEngine {

    /** Default maximum lines of output per execution. */
    public static final int DEFAULT_MAX_OUTPUT_LINES = 1000;

    /** Default maximum source code length in characters. */
    public static final int DEFAULT_MAX_SOURCE_LENGTH = 10_000;

    private ExonEngine() {
        // Utility class — not instantiable.
    }

    /**
     * Runs the given Exon source code with default limits.
     *
     * @param source the Exon source code string
     * @return an {@link ExonResult} containing output, errors, and timing
     */
    public static ExonResult run(String source) {
        return run(source, DEFAULT_MAX_OUTPUT_LINES);
    }

    /**
     * Runs the given Exon source code with a custom output line limit.
     *
     * @param source       the Exon source code string
     * @param maxOutputLines maximum number of output lines before aborting
     * @return an {@link ExonResult} containing output, errors, and timing
     */
    public static ExonResult run(String source, int maxOutputLines) {
        long startTime = System.currentTimeMillis();

        if (source == null || source.isBlank()) {
            return ExonResult.success("", 0);
        }

        if (source.length() > DEFAULT_MAX_SOURCE_LENGTH) {
            return ExonResult.failure(
                List.of(new ExonError(0,
                    "Source code exceeds maximum length of " + DEFAULT_MAX_SOURCE_LENGTH + " characters.",
                    ExonError.ErrorType.SCAN)),
                "",
                0
            );
        }

        OutputCollector outputCollector = new OutputCollector(maxOutputLines);
        ErrorCollector errorCollector = new ErrorCollector();

        // ── Stage 1: Scan ────────────────────────────────────────────────
        Scanner scanner = new Scanner(source, errorCollector);
        List<Token> tokens = scanner.scanTokens();

        if (errorCollector.hasErrors()) {
            return ExonResult.failure(errorCollector.getErrors(), "", elapsed(startTime));
        }

        // ── Stage 2: Parse ───────────────────────────────────────────────
        Parser parser = new Parser(tokens, errorCollector);
        List<Stmt> statements = parser.parse();

        if (errorCollector.hasErrors()) {
            return ExonResult.failure(errorCollector.getErrors(), "", elapsed(startTime));
        }

        // ── Stage 3: Resolve ─────────────────────────────────────────────
        Interpreter interpreter = new Interpreter(outputCollector, errorCollector);
        Resolver resolver = new Resolver(interpreter, errorCollector);
        resolver.resolve(statements);

        if (errorCollector.hasErrors()) {
            return ExonResult.failure(errorCollector.getErrors(), "", elapsed(startTime));
        }

        // ── Stage 4: Interpret ───────────────────────────────────────────
        interpreter.interpret(statements);

        long elapsed = elapsed(startTime);

        if (errorCollector.hasErrors()) {
            // Runtime errors: return partial output + errors
            return ExonResult.failure(
                errorCollector.getErrors(),
                outputCollector.getOutput(),
                elapsed
            );
        }

        return ExonResult.success(outputCollector.getOutput(), elapsed);
    }

    /**
     * Parses the source code into statements and returns the printed AST tree.
     */
    public static ExonResult ast(String source) {
        long startTime = System.currentTimeMillis();

        if (source == null || source.isBlank()) {
            return ExonResult.success("", 0);
        }

        ErrorCollector errorCollector = new ErrorCollector();
        Scanner scanner = new Scanner(source, errorCollector);
        List<Token> tokens = scanner.scanTokens();

        if (errorCollector.hasErrors()) {
            return ExonResult.failure(errorCollector.getErrors(), "", elapsed(startTime));
        }

        Parser parser = new Parser(tokens, errorCollector);
        List<Stmt> statements = parser.parse();

        if (errorCollector.hasErrors()) {
            return ExonResult.failure(errorCollector.getErrors(), "", elapsed(startTime));
        }

        String printedAst = new AstPrinter().print(statements);
        return ExonResult.success(printedAst, elapsed(startTime));
    }

    private static long elapsed(long startTimeMs) {
        return System.currentTimeMillis() - startTimeMs;
    }
}
