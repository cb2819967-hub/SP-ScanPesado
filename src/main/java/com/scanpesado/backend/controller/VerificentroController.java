package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Verificentro;
import com.scanpesado.backend.service.VerificentroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/verificentros")
public class VerificentroController {

    @Autowired
    private VerificentroService verificentroService;

    @GetMapping
    public List<Map<String, Object>> getAllVerificentros() {
        return verificentroService.getAllVerificentros().stream()
                .map(v -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", v.getId());
                    map.put("nombre", v.getNombre());
                    map.put("clave", v.getClaveVerificentro() != null ? v.getClaveVerificentro() : "");
                    map.put("region", v.getRegion() != null ? v.getRegion().getNombreRegion() : "N/A");
                    map.put("region_id", v.getRegion() != null ? v.getRegion().getId() : null); // Agregado para el Modal
                    map.put("responsable", v.getResponsable() != null ? v.getResponsable() : "");
                    map.put("direccion", v.getDireccion() != null ? v.getDireccion() : "");
                    map.put("horario", v.getHorario() != null ? v.getHorario() : "");
                    map.put("correo", v.getCorreo() != null ? v.getCorreo() : "");
                    map.put("telefono", v.getTelefono() != null ? v.getTelefono() : "");
                    map.put("tel_alternativo", v.getTelAlternativo() != null ? v.getTelAlternativo() : "");
                    map.put("activo", v.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Verificentro> createVerificentro(@RequestBody Verificentro verificentro) {
        return ResponseEntity.ok(verificentroService.saveVerificentro(verificentro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Verificentro> updateVerificentro(@PathVariable Long id, @RequestBody Verificentro verificentro) {
        verificentro.setId(id);
        return ResponseEntity.ok(verificentroService.saveVerificentro(verificentro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVerificentro(@PathVariable Long id) {
        verificentroService.deleteVerificentro(id);
        return ResponseEntity.noContent().build();
    }
}