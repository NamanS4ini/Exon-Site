package com.exon.api.controller;

import com.exon.api.model.RunRequest;
import com.exon.api.model.RunResponse;
import com.exon.api.service.ExecutionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for executing Exon source code.
 *
 * <p>POST /api/run — accepts a JSON body with a "source" field and
 * returns the program's output (or errors) as JSON.</p>
 */
@RestController
@RequestMapping("/api")
public class RunController {

    private final ExecutionService executionService;

    public RunController(ExecutionService executionService) {
        this.executionService = executionService;
    }

    /**
     * Executes the submitted Exon source code.
     *
     * @param request validated request body
     * @return 200 OK with RunResponse (even on interpreter errors — HTTP 200 means the API worked)
     */
    @PostMapping("/run")
    public ResponseEntity<RunResponse> run(@Valid @RequestBody RunRequest request) {
        RunResponse response = executionService.execute(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Parses the submitted Exon source code and returns its Abstract Syntax Tree (AST).
     */
    @PostMapping("/ast")
    public ResponseEntity<RunResponse> ast(@Valid @RequestBody RunRequest request) {
        RunResponse response = executionService.executeAst(request);
        return ResponseEntity.ok(response);
    }
}
