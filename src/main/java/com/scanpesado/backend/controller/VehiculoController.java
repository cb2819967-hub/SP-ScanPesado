package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Vehiculo;
import com.scanpesado.backend.service.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {
    
    @Autowired
    private VehiculoService vehiculoService;

    @GetMapping
    public List<Map<String, Object>> getAllVehiculos() {
        return vehiculoService.getAllVehiculos().stream()
            .map(v -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", v.getId());
                map.put("placa", v.getPlaca());
                map.put("serie", v.getSerie());
                map.put("tipo", v.getTipo() != null ? v.getTipo() : "N/A");
                map.put("cedis", v.getIdCedis() != null ? v.getIdCedis().toString() : "N/A");
                map.put("activo", v.getActivo());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    @PostMapping
    public ResponseEntity<Vehiculo> createVehiculo(@RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(vehiculoService.saveVehiculo(vehiculo));
    }
}