package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Nota;
import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.service.NotaService;
import com.scanpesado.backend.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @Autowired
    private VerificacionRepository verificacionRepo;

    @GetMapping
    public List<Map<String, Object>> getAllNotas() {
        return notaService.getAllNotas().stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("folio", n.getFolio());
            map.put("cliente_id", n.getCliente() != null ? n.getCliente().getId() : null);
            map.put("cliente_nombre", n.getCliente() != null ? n.getCliente().getRazonSocial() : "N/A");
            map.put("verificentro_id", n.getVerificentro() != null ? n.getVerificentro().getId() : null);
            map.put("verificentro_nombre", n.getVerificentro() != null ? n.getVerificentro().getNombre() : "N/A");
            map.put("tipo_pago", n.getTipoPago());
            map.put("anticipo", n.getAnticipo());
            map.put("pagado_completo", n.getPagadoCompleto());
            map.put("atendio", n.getAtendio());
            map.put("reviso", n.getReviso());
            map.put("comentario", n.getComentario());
            map.put("fecha_contrato", n.getFechaCreacion() != null ? n.getFechaCreacion().toString() : "");
            map.put("activo", n.getActivo());

            // 🟢 MAGIA VISTA 3: Cálculo automático de Verificaciones (VERSIÓN SEGURA CLÁSICA)
            List<Verificacion> verifs = verificacionRepo.findByNotaIdAndActivoTrue(n.getId());

            // 1. Contamos cuántas hay de cada materia usando un Map clásico (A prueba de balas)
            Map<String, Long> conteo = new HashMap<>();
            for (Verificacion v : verifs) {
                if (v.getMateria() != null) {
                    String nombreMateria = String.valueOf(v.getMateria());
                    conteo.put(nombreMateria, conteo.getOrDefault(nombreMateria, 0L) + 1L);
                }
            }

            // 2. Armamos el texto final (Ej. "3 HUMO, 2 MOTRIZ")
            StringBuilder resumenBuilder = new StringBuilder();
            for (Map.Entry<String, Long> entry : conteo.entrySet()) {
                if (resumenBuilder.length() > 0) {
                    resumenBuilder.append(", ");
                }
                resumenBuilder.append(entry.getValue()).append(" ").append(entry.getKey());
            }

            String resumen = resumenBuilder.toString();
            map.put("resumen_verificaciones", resumen.isEmpty() ? "0 Registradas" : resumen);

            return map;
        }).collect(Collectors.toList());
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

    // 🟢 NUEVAS RUTAS PARA ACCIONES MASIVAS
    @PutMapping("/pagar-masivo")
    public ResponseEntity<Void> pagarMasivo(@RequestBody List<Long> ids) {
        notaService.pagarMasivo(ids);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/eliminar-masivo")
    public ResponseEntity<Void> eliminarMasivo(@RequestBody List<Long> ids) {
        notaService.eliminarMasivo(ids);
        return ResponseEntity.ok().build();
    }
}