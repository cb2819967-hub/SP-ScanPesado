package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByActivoTrueOrderByFechaEnvioDescIdDesc();
}