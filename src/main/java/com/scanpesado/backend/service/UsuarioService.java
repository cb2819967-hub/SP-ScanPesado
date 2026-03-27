package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Usuario;
import com.scanpesado.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAllByOrderByActivoDescIdDesc();
    }

    public List<Usuario> getAllActiveUsuarios() {
        return usuarioRepository.findByActivoTrue();
    }

    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void deleteUsuario(Long id) {
        Optional<Usuario> userOpt = usuarioRepository.findById(id);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            user.setActivo(false);
            usuarioRepository.save(user);
        }
    }
}
