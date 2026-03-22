package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Cedis;
import com.scanpesado.backend.service.CedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cedis")
public class CedisController {

    @Autowired
    private CedisService cedisService;

    @GetMapping
    public List<Map<String, Object>> getAllCedis() {
        return cedisService.getAllCedis().stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", c.getId());
                    map.put("nombre", c.getNombre());

                    // Mapeo de nombres para la tabla
                    map.put("cliente", c.getCliente() != null ? c.getCliente().getRazonSocial() : "N/A");
                    map.put("region", c.getRegion() != null ? c.getRegion().getNombreRegion() : "N/A");

                    // Mapeo de IDs para poder editar en el modal
                    map.put("cliente_id", c.getCliente() != null ? c.getCliente().getId() : null);
                    map.put("region_id", c.getRegion() != null ? c.getRegion().getId() : null);

                    map.put("direccion", c.getDireccion() != null ? c.getDireccion() : "");
                    map.put("encargado", c.getEncargado() != null ? c.getEncargado() : "N/A");
                    map.put("correo", c.getCorreo() != null ? c.getCorreo() : "N/A");
                    map.put("telefono", c.getTelefono() != null ? c.getTelefono() : "N/A");
                    map.put("tel_alternativo", c.getTelAlternativo() != null ? c.getTelAlternativo() : "");
                    map.put("activo", c.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Cedis> createCedis(@RequestBody Cedis cedis) {
        return ResponseEntity.ok(cedisService.saveCedis(cedis));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cedis> updateCedis(@PathVariable Long id, @RequestBody Cedis cedis) {
        cedis.setId(id);
        return ResponseEntity.ok(cedisService.saveCedis(cedis));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCedis(@PathVariable Long id) {
        cedisService.deleteCedis(id);
        return ResponseEntity.noContent().build();
    }
}