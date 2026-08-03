package com.exon.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * GET /api/health — lightweight liveness probe.
 *
 * <p>Intended for use by the Render keep-alive cron and load balancers.
 * Returns HTTP 200 with a JSON status object.</p>
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "exon-api");
    }
}
