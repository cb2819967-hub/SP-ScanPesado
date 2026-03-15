package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByActivoTrue();
    long countByActivoTrue();
}
