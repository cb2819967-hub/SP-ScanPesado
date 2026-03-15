package com.scanpesado.backend.controller;

import com.scanpesado.backend.dto.StatsDto;
import com.scanpesado.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    public StatsDto getStats() {
        return statsService.getStats();
    }
}
