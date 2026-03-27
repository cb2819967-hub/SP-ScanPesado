package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findAllByOrderByFechaCapturaDesc();
    List<Evaluacion> findByActivoTrueOrderByFechaCapturaDesc();
    List<Evaluacion> findByIdTecnicoAndActivoTrueOrderByFechaCapturaDesc(Long idTecnico);
    List<Evaluacion> findByIdVerificacionAndActivoTrueOrderByFechaCapturaDesc(Long idVerificacion);
    List<Evaluacion> findByIdVerificacionInAndActivoTrueOrderByFechaCapturaDesc(List<Long> idsVerificacion);
}
