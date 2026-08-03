package com.exon.api.controller;

import com.exon.api.model.ExampleProgram;
import com.exon.api.service.ExamplesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for built-in Exon example programs.
 *
 * <ul>
 *   <li>GET /api/examples       — returns all examples</li>
 *   <li>GET /api/examples/{id}  — returns a single example by id</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/examples")
public class ExamplesController {

    private final ExamplesService examplesService;

    public ExamplesController(ExamplesService examplesService) {
        this.examplesService = examplesService;
    }

    @GetMapping
    public List<ExampleProgram> list() {
        return examplesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExampleProgram> get(@PathVariable String id) {
        return examplesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
