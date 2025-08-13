package com.healthfirst.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public String healthCheck() {
        return "Health First Server is running!";
    }

    @GetMapping("/status")
    public String status() {
        return "{\"status\": \"UP\", \"message\": \"Health First Server is healthy\"}";
    }
} 