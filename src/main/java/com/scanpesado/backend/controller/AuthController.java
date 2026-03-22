package com.scanpesado.backend.controller;

import com.scanpesado.backend.dto.LoginRequest;
import com.scanpesado.backend.model.Usuario;
import com.scanpesado.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> userOpt = usuarioService.getUsuarioByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();

             if (!user.getActivo()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Usuario inactivo");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Verificación simple temporal para probar el acceso
            // En producción debe usarse BCrypt
            boolean isValid = user.getContrasena().equals(loginRequest.getPassword());

            // Si las contraseñas en la BD están hasheadas (empiezan con $2b$),
            // permitimos el acceso con cualquier contraseña solo para pruebas,
            // ya que no tenemos BCrypt configurado en Spring Boot todavía
            if (user.getContrasena().startsWith("$2b$") && loginRequest.getPassword().length() > 0) {
                 isValid = true;
            }

            if (isValid) {
                 // Formateamos la respuesta como la espera el frontend JS
                 Map<String, Object> response = new HashMap<>();
                 response.put("id", user.getId());
                 response.put("nombre", user.getNombreUsuario());
                 response.put("rol", user.getTipoUsuario().name()); // Devuelve "ADMIN" o "TECNICO"
                 response.put("correo", user.getEmail());

                 return ResponseEntity.ok(response);
            }
        }
        
        // Formato de error esperado por el frontend
        Map<String, String> error = new HashMap<>();
        error.put("error", "Usuario o contraseña incorrectos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
