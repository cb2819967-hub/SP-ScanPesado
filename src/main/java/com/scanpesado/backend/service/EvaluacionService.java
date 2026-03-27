package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Evaluacion;
import com.scanpesado.backend.repository.EvaluacionRepository;
import com.scanpesado.backend.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.scanpesado.backend.model.Verificacion;

@Service
public class EvaluacionService {

    @Autowired
    private EvaluacionRepository evaluacionRepository;

    @Autowired
    private VerificacionRepository verificacionRepository;

    public Evaluacion createEvaluacion(Long idVerificacion, Long idTecnico) {
        Evaluacion eval = new Evaluacion();
        eval.setIdVerificacion(idVerificacion);
        eval.setIdTecnico(idTecnico);
        return evaluacionRepository.save(eval);
    }

    public Evaluacion saveEvaluacion(Evaluacion evaluacion) {
        if (evaluacion.getFechaCaptura() == null) {
            evaluacion.setFechaCaptura(LocalDateTime.now());
        }
        if (evaluacion.getActivo() == null) {
            evaluacion.setActivo(true);
        }
        if (evaluacion.getComentarios() == null && evaluacion.getComentariosTecnico() != null) {
            evaluacion.setComentarios(evaluacion.getComentariosTecnico());
        }
        return evaluacionRepository.save(evaluacion);
    }

    public Optional<Evaluacion> updateEvaluacion(Long id, Evaluacion newData) {
        return evaluacionRepository.findById(id).map(eval -> {
            mergeNonNullFields(eval, newData);
            if (eval.getComentariosTecnico() != null) {
                eval.setComentarios(eval.getComentariosTecnico());
            }
            return evaluacionRepository.save(eval);
        });
    }

    public List<Evaluacion> getAllEvaluaciones() {
        return evaluacionRepository.findAllByOrderByFechaCapturaDesc();
    }

    public List<Evaluacion> getActiveEvaluaciones() {
        return evaluacionRepository.findByActivoTrueOrderByFechaCapturaDesc();
    }

    public List<Evaluacion> getEvaluacionesByTecnico(Long idTecnico) {
        return evaluacionRepository.findByIdTecnicoAndActivoTrueOrderByFechaCapturaDesc(idTecnico);
    }

    public List<Evaluacion> getEvaluacionesByVehiculo(Long idVehiculo) {
        List<Long> idsVerificacion = verificacionRepository.findByVehiculoIdAndActivoTrueOrderByFechaVerificacionDesc(idVehiculo).stream()
                .map(Verificacion::getId)
                .collect(Collectors.toList());
        if (idsVerificacion.isEmpty()) {
            return Collections.emptyList();
        }
        return evaluacionRepository.findByIdVerificacionInAndActivoTrueOrderByFechaCapturaDesc(idsVerificacion);
    }

    public Optional<Evaluacion> getEvaluacionByVerificacion(Long idVerificacion) {
        List<Evaluacion> evaluaciones = evaluacionRepository.findByIdVerificacionAndActivoTrueOrderByFechaCapturaDesc(idVerificacion);
        return evaluaciones.isEmpty() ? Optional.empty() : Optional.of(evaluaciones.get(0));
    }

    public void deleteEvaluacion(Long id) {
        evaluacionRepository.findById(id).ifPresent(evaluacion -> {
            evaluacion.setActivo(false);
            evaluacionRepository.save(evaluacion);
        });
    }

    private void mergeNonNullFields(Evaluacion target, Evaluacion source) {
        for (Field field : Evaluacion.class.getDeclaredFields()) {
            String name = field.getName();
            if ("id".equals(name) || "idVerificacion".equals(name) || "idTecnico".equals(name)) {
                continue;
            }
            field.setAccessible(true);
            try {
                Object value = field.get(source);
                if (value != null) {
                    field.set(target, value);
                }
            } catch (IllegalAccessException ignored) {
                // No-op: all fields are declared in the same entity.
            }
        }
    }
}
