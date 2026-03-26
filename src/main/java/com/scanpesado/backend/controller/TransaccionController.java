package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Transaccion;
import com.scanpesado.backend.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {
    @Autowired
    private TransaccionService service;

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.getAllTransacciones().stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("gestor", t.getNota() != null && t.getNota().getCliente() != null ? t.getNota().getCliente().getGestor() : "—");
            map.put("razon_social", t.getNota() != null && t.getNota().getCliente() != null ? t.getNota().getCliente().getRazonSocial() : "—");
            map.put("verificentro", t.getNota() != null && t.getNota().getVerificentro() != null ? t.getNota().getVerificentro().getNombre() : "—");
            map.put("nota_folio", t.getNota() != null ? t.getNota().getFolio() : "—");
            map.put("nota_id", t.getNota() != null ? t.getNota().getId() : null);
            map.put("placa", t.getVehiculo() != null ? t.getVehiculo().getPlaca() : "—");
            map.put("serie", t.getVehiculo() != null ? t.getVehiculo().getSerie() : "—");
            map.put("materia", t.getMateria());
            map.put("precio", t.getPrecio());
            map.put("tipo_pago", t.getTipoPago());
            map.put("cotizacion", t.getCotizacion());
            map.put("fecha_folio", t.getFechaFolio() != null ? t.getFechaFolio().toString() : "");
            map.put("folio", t.getFolio());
            map.put("cuenta_deposito", t.getCuentaDeposito());
            map.put("numero_factura", t.getNumeroFactura());
            map.put("pagado", t.getPagado());
            map.put("pendiente", t.getPendiente());
            map.put("fecha_pedido", t.getFechaPedido() != null ? t.getFechaPedido().toString() : "");
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Transaccion> create(@RequestBody Transaccion t) { return ResponseEntity.ok(service.saveTransaccion(t)); }

    // Endpoints de Acciones Masivas
    @PutMapping("/pagar-masivo")
    public ResponseEntity<Void> pagarMasivo(@RequestBody List<Long> ids) {
        service.pagarMasivo(ids); return ResponseEntity.ok().build();
    }

    @PutMapping("/eliminar-masivo")
    public ResponseEntity<Void> eliminarMasivo(@RequestBody List<Long> ids) {
        service.eliminarMasivo(ids); return ResponseEntity.ok().build();
    }
}