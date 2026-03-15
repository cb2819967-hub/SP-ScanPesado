package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Verificentro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VerificentroRepository extends JpaRepository<Verificentro, Long> {
    List<Verificentro> findByActivoTrue();
}
