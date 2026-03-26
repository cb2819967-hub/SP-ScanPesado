package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByActivoTrue();
}