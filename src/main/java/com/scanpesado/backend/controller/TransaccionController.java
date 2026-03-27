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
        return service.getAllTransacciones().stream().map(transaccion -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", transaccion.getId());
            map.put("gestor", transaccion.getNota() != null && transaccion.getNota().getCliente() != null ? transaccion.getNota().getCliente().getGestor() : "-");
            map.put("razon_social", transaccion.getNota() != null && transaccion.getNota().getCliente() != null ? transaccion.getNota().getCliente().getRazonSocial() : "-");
            map.put("verificentro", transaccion.getNota() != null && transaccion.getNota().getVerificentro() != null ? transaccion.getNota().getVerificentro().getNombre() : "-");
            map.put("nota_folio", transaccion.getNota() != null ? transaccion.getNota().getFolio() : "-");
            map.put("nota_id", transaccion.getNota() != null ? transaccion.getNota().getId() : null);
            map.put("placa", transaccion.getVehiculo() != null ? transaccion.getVehiculo().getPlaca() : "-");
            map.put("serie", transaccion.getVehiculo() != null ? transaccion.getVehiculo().getSerie() : "-");
            map.put("materia", transaccion.getMateria());
            map.put("precio", transaccion.getPrecio());
            map.put("tipo_pago", transaccion.getTipoPago());
            map.put("cotizacion", transaccion.getCotizacion());
            map.put("fecha_folio", transaccion.getFechaFolio() != null ? transaccion.getFechaFolio().toString() : "");
            map.put("folio", transaccion.getFolio());
            map.put("cuenta_deposito", transaccion.getCuentaDeposito());
            map.put("numero_factura", transaccion.getNumeroFactura());
            map.put("pagado", transaccion.getPagado());
            map.put("pendiente", transaccion.getPendiente());
            map.put("fecha_pedido", transaccion.getFechaPedido() != null ? transaccion.getFechaPedido().toString() : "");
            map.put("activo", transaccion.getActivo());
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Transaccion> create(@RequestBody Transaccion transaccion) {
        return ResponseEntity.ok(service.saveTransaccion(transaccion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTransaccion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/pagar-masivo")
    public ResponseEntity<Void> pagarMasivo(@RequestBody List<Long> ids) {
        service.pagarMasivo(ids);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/eliminar-masivo")
    public ResponseEntity<Void> eliminarMasivo(@RequestBody List<Long> ids) {
        service.eliminarMasivo(ids);
        return ResponseEntity.ok().build();
    }
}
