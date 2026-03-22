package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Verificentro;
import com.scanpesado.backend.repository.VerificentroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VerificentroService {
    @Autowired
    private VerificentroRepository verificentroRepository;

    // Cambiado para que el frontend maneje el filtro de Activos/Inactivos
    public List<Verificentro> getAllVerificentros() {
        return verificentroRepository.findAll();
    }

    public Verificentro saveVerificentro(Verificentro verificentro) {
        return verificentroRepository.save(verificentro);
    }

    // Borrado lógico
    public void deleteVerificentro(Long id) {
        verificentroRepository.findById(id).ifPresent(verificentro -> {
            verificentro.setActivo(false);
            verificentroRepository.save(verificentro);
        });
    }
}