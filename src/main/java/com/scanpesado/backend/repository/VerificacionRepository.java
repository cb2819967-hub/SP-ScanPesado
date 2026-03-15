package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    List<Verificacion> findByActivoTrueOrderByFechaVerificacionDesc();
    long countByActivoTrue();
}
