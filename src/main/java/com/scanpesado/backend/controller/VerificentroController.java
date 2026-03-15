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
                map.put("clave", v.getClaveVerificentro() != null ? v.getClaveVerificentro() : "N/A");
                map.put("region", v.getRegion() != null ? v.getRegion().getNombreRegion() : "N/A");
                map.put("responsable", v.getResponsable() != null ? v.getResponsable() : "N/A");
                map.put("direccion", v.getDireccion() != null ? v.getDireccion() : "N/A");
                map.put("horario", v.getHorario() != null ? v.getHorario() : "N/A");
                map.put("activo", v.getActivo());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    @PostMapping
    public ResponseEntity<Verificentro> createVerificentro(@RequestBody Verificentro verificentro) {
        return ResponseEntity.ok(verificentroService.saveVerificentro(verificentro));
    }
}