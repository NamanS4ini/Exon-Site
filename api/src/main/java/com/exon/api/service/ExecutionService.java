package com.exon.api.service;

import com.exon.api.model.ErrorDetail;
import com.exon.api.model.RunRequest;
import com.exon.api.model.RunResponse;
import com.interpreter.exon.ExonEngine;
import com.interpreter.exon.ExonError;
import com.interpreter.exon.ExonResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;

/**
 * Executes Exon source code inside a sandboxed, time-limited Future.
 *
 * <p>Each call submits the work to a cached thread pool and enforces a hard
 * wall-clock timeout. Output and source-length limits are enforced by the
 * ExonEngine itself.</p>
 */
@Service
public class ExecutionService {

    private final long timeoutMs;
    private final int maxOutputLines;

    private final ExecutorService executor = Executors.newCachedThreadPool(r -> {
        Thread t = new Thread(r, "exon-exec");
        t.setDaemon(true);
        return t;
    });

    public ExecutionService(
            @Value("${exon.execution.timeout-ms:5000}") long timeoutMs,
            @Value("${exon.execution.max-output-lines:1000}") int maxOutputLines) {
        this.timeoutMs = timeoutMs;
        this.maxOutputLines = maxOutputLines;
    }

    /**
     * Executes the Exon program in the given request.
     *
     * @param request validated run request
     * @return a {@link RunResponse} describing the outcome
     */
    public RunResponse execute(RunRequest request) {
        long wallStart = System.currentTimeMillis();

        Future<ExonResult> future = executor.submit(() ->
                ExonEngine.run(request.source(), maxOutputLines));

        try {
            ExonResult result = future.get(timeoutMs, TimeUnit.MILLISECONDS);
            return toResponse(result);
        } catch (TimeoutException e) {
            future.cancel(true);
            long elapsed = System.currentTimeMillis() - wallStart;
            return RunResponse.timeout(elapsed);
        } catch (ExecutionException e) {
            // Unexpected interpreter crash — wrap as runtime error
            long elapsed = System.currentTimeMillis() - wallStart;
            String msg = e.getCause() != null ? e.getCause().getMessage() : "Internal interpreter error.";
            return RunResponse.failure("", List.of(new ErrorDetail(0, msg, "RUNTIME")), elapsed);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return RunResponse.requestError("Request was interrupted.");
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static RunResponse toResponse(ExonResult result) {
        if (result.isSuccess()) {
            return RunResponse.success(result.getOutput(), result.getExecutionTimeMs());
        }
        List<ErrorDetail> errors = result.getErrors().stream()
                .map(ExecutionService::toDetail)
                .toList();
        return RunResponse.failure(result.getOutput(), errors, result.getExecutionTimeMs());
    }

    private static ErrorDetail toDetail(ExonError error) {
        return new ErrorDetail(error.line(), error.message(), error.type().name());
    }
}
