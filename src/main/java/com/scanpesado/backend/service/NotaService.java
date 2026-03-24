package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Nota;
import com.scanpesado.backend.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotaService {
    @Autowired
    private NotaRepository notaRepository;

    public List<Nota> getAllNotas() {
        return notaRepository.findAll();
    }

    public Nota saveNota(Nota nota) {
        return notaRepository.save(nota);
    }

    public void deleteNota(Long id) {
        notaRepository.findById(id).ifPresent(nota -> {
            nota.setActivo(false);
            notaRepository.save(nota);
        });
    }
}