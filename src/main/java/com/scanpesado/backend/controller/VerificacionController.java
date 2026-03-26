package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.service.VerificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/verificaciones")
public class VerificacionController {

    @Autowired
    private VerificacionService verificacionService;

    @GetMapping
    public List<Map<String, Object>> getRecentVerificaciones() {
        return verificacionService.getRecentVerificaciones().stream()
                .map(v -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", v.getId());

                    // 🟢 CORRECCIÓN: Extraer el ID desde el objeto Nota
                    map.put("id_nota", v.getNota() != null ? v.getNota().getId() : "N/A");
                    // 💡 De paso, enviamos el folio de la nota que siempre es útil en el frontend
                    map.put("nota_folio", v.getNota() != null ? v.getNota().getFolio() : "N/A");

                    map.put("vehiculo_id", v.getVehiculo() != null ? v.getVehiculo().getId() : null);
                    map.put("unidad", v.getVehiculo() != null ? v.getVehiculo().getPlaca() : "N/A");
                    map.put("materia", v.getMateria() != null ? v.getMateria().name() : "N/A");
                    map.put("precio", v.getPrecio() != null ? v.getPrecio() : 0.0);
                    map.put("multa", v.getMulta() != null ? v.getMulta() : 0.0);
                    map.put("folio", v.getFolioVerificacion() != null ? v.getFolioVerificacion() : "N/A");
                    map.put("fecha", v.getFechaVerificacion() != null ? v.getFechaVerificacion().toString() : "N/A");
                    map.put("resultado", v.getDictamen() != null ? v.getDictamen().name() : "PENDIENTE");
                    map.put("tecnico", "Por asignar"); // Esto se llenará cuando hagamos la App del Técnico
                    map.put("activo", v.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Verificacion> createVerificacion(@RequestBody Verificacion verificacion) {
        return ResponseEntity.ok(verificacionService.saveVerificacion(verificacion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Verificacion> updateVerificacion(@PathVariable Long id, @RequestBody Verificacion verificacion) {
        verificacion.setId(id);
        return ResponseEntity.ok(verificacionService.saveVerificacion(verificacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVerificacion(@PathVariable Long id) {
        verificacionService.deleteVerificacion(id);
        return ResponseEntity.noContent().build();
    }
}