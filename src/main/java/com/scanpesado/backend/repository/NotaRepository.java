package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    long countByActivoTrue();
    // Agregamos el ordenamiento automático aquí:
    List<Nota> findAllByOrderByActivoDescIdDesc();
}