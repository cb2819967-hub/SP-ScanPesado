package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Costo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CostoRepository extends JpaRepository<Costo, Long> {
    List<Costo> findByActivoTrue();
}