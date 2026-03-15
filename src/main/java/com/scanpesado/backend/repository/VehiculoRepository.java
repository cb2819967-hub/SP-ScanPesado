package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    List<Vehiculo> findByActivoTrue();
    long countByActivoTrue();
}
