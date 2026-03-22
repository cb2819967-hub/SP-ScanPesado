package com.scanpesado.backend.controller;

import com.scanpesado.backend.model.Usuario;
import com.scanpesado.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Map<String, Object>> getAllUsuarios() {
        return usuarioService.getAllActiveUsuarios().stream()
            .map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("nombre", u.getNombreUsuario());
                map.put("correo", u.getEmail());
                map.put("rol", u.getTipoUsuario() != null ? u.getTipoUsuario().name() : "");
                map.put("activo", u.getActivo());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.saveUsuario(usuario));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return ResponseEntity.ok(usuarioService.saveUsuario(usuario));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}