package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private VerificacionRepository verificacionRepo;

    @GetMapping
    public List<Map<String, Object>> getReporteEvaluaciones() {
        // Traemos todas las verificaciones activas, de la más reciente a la más vieja
        List<Verificacion> verificaciones = verificacionRepo.findByActivoTrueOrderByFechaVerificacionDesc();

        return verificaciones.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();

            // 1. Datos de la Verificación
            map.put("folio_verificacion", v.getFolioVerificacion() != null ? v.getFolioVerificacion() : "S/F");
            map.put("fecha", v.getFechaVerificacion() != null ? v.getFechaVerificacion().toString() : "—");
            map.put("dictamen", v.getDictamen() != null ? v.getDictamen().name() : "PENDIENTE");
            map.put("materia", v.getMateria());

            // 2. Datos del Vehículo y su Ubicación
            if (v.getVehiculo() != null) {
                map.put("placa", v.getVehiculo().getPlaca());
                map.put("serie", v.getVehiculo().getSerie());
                if (v.getVehiculo().getCedis() != null) {
                    map.put("cedis", v.getVehiculo().getCedis().getNombre());
                    if (v.getVehiculo().getCedis().getRegion() != null) {
                        map.put("region", v.getVehiculo().getCedis().getRegion().getNombreRegion());
                    }
                }
            } else {
                map.put("placa", "—"); map.put("serie", "—"); map.put("cedis", "—"); map.put("region", "—");
            }

            // 3. Datos del Contrato (Nota y Cliente)
            if (v.getNota() != null) {
                map.put("folio_nota", v.getNota().getFolio());
                if (v.getNota().getCliente() != null) {
                    map.put("cliente", v.getNota().getCliente().getRazonSocial());
                }
            } else {
                map.put("folio_nota", "—"); map.put("cliente", "—");
            }

            // 4. Placeholders (Hasta que hagamos el módulo del técnico)
            map.put("tecnico", "Pendiente");
            map.put("causa_reprobacion", "—");

            return map;
        }).collect(Collectors.toList());
    }
}