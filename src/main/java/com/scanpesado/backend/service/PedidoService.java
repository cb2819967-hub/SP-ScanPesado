package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Pedido;
import com.scanpesado.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findByActivoTrueOrderByFechaEnvioDescIdDesc();
    }

    public Pedido savePedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deletePedido(Long id) {
        pedidoRepository.findById(id).ifPresent(p -> {
            p.setActivo(false);
            pedidoRepository.save(p);
        });
    }

    public void eliminarMasivo(List<Long> ids) {
        List<Pedido> pedidos = pedidoRepository.findAllById(ids);
        pedidos.forEach(p -> p.setActivo(false));
        pedidoRepository.saveAll(pedidos);
    }
}