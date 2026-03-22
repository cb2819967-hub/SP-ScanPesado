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

                    // Mapeo del cliente
                    map.put("cliente_id", v.getCliente() != null ? v.getCliente().getId() : null);

                    // Mapeo del CEDIS (Como es un Long directo, lo pasamos tal cual)
                    map.put("cedis_id", v.getIdCedis());

                    map.put("activo", v.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Vehiculo> createVehiculo(@RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(vehiculoService.saveVehiculo(vehiculo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> updateVehiculo(@PathVariable Long id, @RequestBody Vehiculo vehiculo) {
        vehiculo.setId(id);
        return ResponseEntity.ok(vehiculoService.saveVehiculo(vehiculo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehiculo(@PathVariable Long id) {
        vehiculoService.deleteVehiculo(id);
        return ResponseEntity.noContent().build();
    }
}