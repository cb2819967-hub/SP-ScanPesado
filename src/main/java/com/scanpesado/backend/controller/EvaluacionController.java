package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Evaluacion;
import com.scanpesado.backend.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/movil/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    @PostMapping("/")
    public ResponseEntity<Evaluacion> iniciarEvaluacion(
            @RequestParam("id_verificacion") Long idVerificacion,
            @RequestParam("id_tecnico") Long idTecnico) {
        return ResponseEntity.ok(evaluacionService.createEvaluacion(idVerificacion, idTecnico));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evaluacion> actualizarEvaluacion(@PathVariable Long id, @RequestBody Evaluacion datos) {
        Optional<Evaluacion> updated = evaluacionService.updateEvaluacion(id, datos);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
