package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByActivoTrue();
    List<Usuario> findAllByOrderByActivoDescIdDesc();
}
