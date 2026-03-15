package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Cliente;
import com.scanpesado.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Map<String, Object>> getAllClientes() {
        return clienteService.getAllClientes().stream()
            .map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId());
                map.put("razon_social", c.getRazonSocial());
                map.put("correo", c.getEmail() != null ? c.getEmail() : "");
                map.put("telefono", c.getTelefono() != null ? c.getTelefono() : "");
                map.put("activo", c.getActivo());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    @PostMapping
    public ResponseEntity<Cliente> createCliente(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.saveCliente(cliente));
    }
}