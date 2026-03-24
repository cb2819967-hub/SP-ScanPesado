package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Nota;
import com.scanpesado.backend.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    public List<Map<String, Object>> getAllNotas() {
        return notaService.getAllNotas().stream()
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", n.getId());
                    map.put("folio", n.getFolio());

                    // Relaciones
                    map.put("cliente_id", n.getCliente() != null ? n.getCliente().getId() : null);
                    map.put("cliente_nombre", n.getCliente() != null ? n.getCliente().getRazonSocial() : "N/A");
                    map.put("verificentro_id", n.getVerificentro() != null ? n.getVerificentro().getId() : null);
                    map.put("verificentro_nombre", n.getVerificentro() != null ? n.getVerificentro().getNombre() : "N/A");

                    // Datos financieros y operativos
                    map.put("tipo_pago", n.getTipoPago() != null ? n.getTipoPago() : "N/A");
                    map.put("anticipo", n.getAnticipo() != null ? n.getAnticipo() : 0.0);
                    map.put("pagado_completo", n.getPagadoCompleto() != null ? n.getPagadoCompleto() : false);
                    map.put("atendio", n.getAtendio() != null ? n.getAtendio() : "N/A");
                    map.put("reviso", n.getReviso() != null ? n.getReviso() : "N/A");
                    map.put("comentario", n.getComentario() != null ? n.getComentario() : "");

                    // Fechas
                    map.put("fecha_contrato", n.getFechaContrato() != null ? n.getFechaContrato().toString() : "");
                    map.put("fecha_vigencia", n.getFechaVigencia() != null ? n.getFechaVigencia().toString() : "");

                    map.put("activo", n.getActivo());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Nota> createNota(@RequestBody Nota nota) {
        return ResponseEntity.ok(notaService.saveNota(nota));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nota> updateNota(@PathVariable Long id, @RequestBody Nota nota) {
        nota.setId(id);
        return ResponseEntity.ok(notaService.saveNota(nota));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNota(@PathVariable Long id) {
        notaService.deleteNota(id);
        return ResponseEntity.noContent().build();
    }
}