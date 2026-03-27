package com.scanpesado.backend.controller;

import com.scanpesado.backend.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.scanpesado.backend.model.Region;

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

    @PostMapping
    public ResponseEntity<Region> createRegion(@RequestBody Region region) {
        return ResponseEntity.ok(regionService.saveRegion(region));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Region> updateRegion(@PathVariable Long id, @RequestBody Region region) {
        region.setId(id);
        return ResponseEntity.ok(regionService.saveRegion(region));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegion(@PathVariable Long id) {
        regionService.deleteRegion(id);
        return ResponseEntity.noContent().build();
    }
}
