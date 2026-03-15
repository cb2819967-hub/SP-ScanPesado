package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Cedis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CedisRepository extends JpaRepository<Cedis, Long> {
    List<Cedis> findByActivoTrue();
}
