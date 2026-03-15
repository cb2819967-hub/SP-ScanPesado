package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    long countByActivoTrue();
}
