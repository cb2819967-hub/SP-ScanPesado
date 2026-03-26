package com.scanpesado.backend.controller;

import com.scanpesado.backend.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/regiones")
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping
    public List<Map<String, Object>> getAllRegiones() {
        return regionService.getAllRegiones().stream()
                .map(region -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", region.getId());
                    map.put("nombre", region.getNombreRegion());
                    map.put("activo", region.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
