package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Pedido;
import com.scanpesado.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<Map<String, Object>> getAllPedidos() {
        return pedidoService.getAllPedidos().stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("nota_id", p.getNota() != null ? p.getNota().getId() : null);
            map.put("nota_folio", p.getNota() != null ? p.getNota().getFolio() : "N/A");

            // Extraemos el cliente desde la nota
            String clienteNombre = "N/A";
            if (p.getNota() != null && p.getNota().getCliente() != null) {
                clienteNombre = p.getNota().getCliente().getRazonSocial();
            }
            map.put("cliente_nombre", clienteNombre);

            map.put("fecha_envio", p.getFechaEnvio() != null ? p.getFechaEnvio().toString() : "");
            map.put("numero_guia", p.getNumeroGuia());
            map.put("recibio", p.getRecibio());
            map.put("foto", p.getFoto());
            map.put("estatus_envio", p.getEstatusEnvio() != null ? p.getEstatusEnvio().name() : "");
            map.put("comentario", p.getComentario());
            map.put("activo", p.getActivo());

            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Pedido> createPedido(@RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.savePedido(pedido));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updatePedido(@PathVariable Long id, @RequestBody Pedido pedido) {
        pedido.setId(id);
        return ResponseEntity.ok(pedidoService.savePedido(pedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/eliminar-masivo")
    public ResponseEntity<Void> eliminarMasivo(@RequestBody List<Long> ids) {
        pedidoService.eliminarMasivo(ids);
        return ResponseEntity.ok().build();
    }
}
