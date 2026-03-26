package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Costo;
import com.scanpesado.backend.service.CostoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/costos")
public class CostoController {

    @Autowired
    private CostoService costoService;

    @GetMapping
    public List<Map<String, Object>> getAllCostos() {
        return costoService.getAllCostos().stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", c.getId());
                    map.put("cliente_id", c.getCliente() != null ? c.getCliente().getId() : null);
                    map.put("cliente_nombre", c.getCliente() != null ? c.getCliente().getRazonSocial() : "N/A");
                    map.put("materia", c.getMateria());
                    map.put("costo", c.getCosto());
                    map.put("encargado", c.getEncargado());
                    map.put("atiende_y_cobra", c.getAtiendeYCobra());
                    map.put("activo", c.getActivo());
                    return map;
                }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Costo> createCosto(@RequestBody Costo costo) {
        return ResponseEntity.ok(costoService.saveCosto(costo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Costo> updateCosto(@PathVariable Long id, @RequestBody Costo costo) {
        costo.setId(id);
        return ResponseEntity.ok(costoService.saveCosto(costo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCosto(@PathVariable Long id) {
        costoService.deleteCosto(id);
        return ResponseEntity.noContent().build();
    }
}