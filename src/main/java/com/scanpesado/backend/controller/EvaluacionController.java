package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Evaluacion;
import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.model.Vehiculo;
import com.scanpesado.backend.repository.VerificacionRepository;
import com.scanpesado.backend.repository.VehiculoRepository;
import com.scanpesado.backend.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/movil/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    @Autowired
    private VerificacionRepository verificacionRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @PostMapping("/")
    public ResponseEntity<Evaluacion> iniciarEvaluacion(
            @RequestParam("id_verificacion") Long idVerificacion,
            @RequestParam("id_tecnico") Long idTecnico) {
        return ResponseEntity.ok(evaluacionService.createEvaluacion(idVerificacion, idTecnico));
    }

    @PostMapping
    public ResponseEntity<Evaluacion> createEvaluacion(@RequestBody Evaluacion evaluacion) {
        return ResponseEntity.ok(evaluacionService.saveEvaluacion(evaluacion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evaluacion> actualizarEvaluacion(@PathVariable Long id, @RequestBody Evaluacion datos) {
        Optional<Evaluacion> updated = evaluacionService.updateEvaluacion(id, datos);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tecnico/{idTecnico}")
    public List<Map<String, Object>> getEvaluacionesTecnico(@PathVariable Long idTecnico) {
        return evaluacionService.getEvaluacionesByTecnico(idTecnico).stream()
                .map(this::toEvaluacionMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/vehiculo/{idVehiculo}")
    public List<Map<String, Object>> getEvaluacionesVehiculo(@PathVariable Long idVehiculo) {
        return evaluacionService.getEvaluacionesByVehiculo(idVehiculo).stream()
                .map(this::toEvaluacionMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/verificacion/{idVerificacion}")
    public ResponseEntity<Map<String, Object>> getEvaluacionVerificacion(@PathVariable Long idVerificacion) {
        return evaluacionService.getEvaluacionByVerificacion(idVerificacion)
                .map(this::toEvaluacionMap)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toEvaluacionMap(Evaluacion evaluacion) {
        Map<String, Object> map = new HashMap<>();
        for (Field field : Evaluacion.class.getDeclaredFields()) {
            field.setAccessible(true);
            try {
                map.put(field.getName(), field.get(evaluacion));
            } catch (IllegalAccessException ignored) {
                // No-op.
            }
        }
        map.put("id", evaluacion.getId());
        map.put("id_verificacion", evaluacion.getIdVerificacion());
        map.put("id_tecnico", evaluacion.getIdTecnico());
        map.put("fecha_captura", evaluacion.getFechaCaptura() != null ? evaluacion.getFechaCaptura().toString() : "");
        map.put("comentarios", evaluacion.getComentariosTecnico() != null ? evaluacion.getComentariosTecnico() : evaluacion.getComentarios());
        map.put("activo", evaluacion.getActivo());

        verificacionRepository.findById(evaluacion.getIdVerificacion()).ifPresent(verificacion -> {
            map.put("folio_verificacion", verificacion.getFolioVerificacion());
            map.put("fecha_verificacion", verificacion.getFechaVerificacion() != null ? verificacion.getFechaVerificacion().toString() : "");
            map.put("materia", verificacion.getMateria() != null ? verificacion.getMateria().name() : "");
            map.put("dictamen", verificacion.getDictamen() != null ? verificacion.getDictamen().name() : "");
            map.put("nota_id", verificacion.getNota() != null ? verificacion.getNota().getId() : null);
            map.put("nota_folio", verificacion.getNota() != null ? verificacion.getNota().getFolio() : "");
            Vehiculo vehiculo = verificacion.getVehiculo();
            if (vehiculo != null) {
                map.put("vehiculo_id", vehiculo.getId());
                map.put("placa", vehiculo.getPlaca());
                map.put("serie", vehiculo.getSerie());
                map.put("cedis", vehiculo.getCedis() != null ? vehiculo.getCedis().getNombre() : "");
                map.put("region", vehiculo.getCedis() != null && vehiculo.getCedis().getRegion() != null ? vehiculo.getCedis().getRegion().getNombreRegion() : "");
            }
        });

        return map;
    }
}
