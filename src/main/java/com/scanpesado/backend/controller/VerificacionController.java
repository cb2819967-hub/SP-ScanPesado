package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.service.VerificacionService;
import org.springframework.beans.factory.annotation.Autowired;
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
                map.put("folio", v.getFolioVerificacion() != null ? v.getFolioVerificacion() : "N/A");
                map.put("unidad", v.getVehiculo() != null ? v.getVehiculo().getPlaca() : "N/A");
                map.put("tecnico", "Técnico"); // Ajustar si tienes el técnico real en el modelo
                map.put("fecha", v.getFechaVerificacion() != null ? v.getFechaVerificacion().toString() : "N/A");
                map.put("resultado", v.getDictamen() != null ? v.getDictamen() : "PENDIENTE");
                return map;
            })
            .collect(Collectors.toList());
    }
}