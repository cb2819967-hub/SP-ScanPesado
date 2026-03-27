package com.scanpesado.backend.config;

import com.scanpesado.backend.model.Usuario;
import com.scanpesado.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner ensureDefaultAdmin(UsuarioRepository usuarioRepository) {
        return args -> usuarioRepository.findByEmail("admin@scanpesado.local").orElseGet(() -> {
            Usuario admin = new Usuario();
            admin.setNombreUsuario("Administrador");
            admin.setEmail("admin@scanpesado.local");
            admin.setContrasena("admin123");
            admin.setTipoUsuario(Usuario.TipoUsuario.ADMIN);
            admin.setActivo(true);
            return usuarioRepository.save(admin);
        });
    }
}
