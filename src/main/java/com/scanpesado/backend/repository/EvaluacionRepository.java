package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
}
