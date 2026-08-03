package com.interpreter.exon;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * CLI entry point for the Exon interpreter.
 *
 * <p>This class is now a thin shell around {@link ExonEngine}.
 * All execution logic lives in ExonEngine, making the interpreter
 * reusable as a library without touching this class.</p>
 *
 * <p>Usage:
 * <pre>
 *   java com.interpreter.exon.Exon              # Start REPL
 *   java com.interpreter.exon.Exon script.exon  # Run a file
 * </pre>
 * </p>
 */
public class Exon {

    public static void main(String[] args) throws IOException {
        if (args.length > 1) {
            System.out.println("Usage: exon [script]");
            System.exit(64);
        } else if (args.length == 1) {
            runFile(args[0]);
        } else {
            runPrompt();
        }
    }

    private static void runFile(String path) throws IOException {
        String source = Files.readString(Paths.get(path), StandardCharsets.UTF_8);
        ExonResult result = ExonEngine.run(source);
        printResult(result);

        if (!result.isSuccess()) {
            boolean hasRuntimeError = result.getErrors().stream()
                .anyMatch(e -> e.type() == ExonError.ErrorType.RUNTIME);
            System.exit(hasRuntimeError ? 70 : 65);
        }
    }

    private static void runPrompt() throws IOException {
        InputStreamReader input = new InputStreamReader(System.in, StandardCharsets.UTF_8);
        BufferedReader reader = new BufferedReader(input);

        System.out.println("Exon REPL — type 'exit' to quit.");

        for (;;) {
            System.out.print("/> ");
            String line = reader.readLine();
            if (line == null || line.equalsIgnoreCase("exit")) break;

            ExonResult result = ExonEngine.run(line);
            printResult(result);
        }
    }

    /** Prints output and errors to stdout/stderr, matching original CLI behaviour. */
    private static void printResult(ExonResult result) {
        if (!result.getOutput().isBlank()) {
            System.out.print(result.getOutput());
        }
        for (ExonError error : result.getErrors()) {
            System.err.println(error.toString());
        }
    }
}