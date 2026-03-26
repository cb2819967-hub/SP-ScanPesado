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
        // Usamos el método que ordena por activos y más recientes
        return notaRepository.findAllByOrderByActivoDescIdDesc();
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

    public void pagarMasivo(List<Long> ids) {
        List<Nota> notas = notaRepository.findAllById(ids);
        notas.forEach(n -> n.setPagadoCompleto(true));
        notaRepository.saveAll(notas);
    }

    public void eliminarMasivo(List<Long> ids) {
        List<Nota> notas = notaRepository.findAllById(ids);
        notas.forEach(n -> n.setActivo(false));
        notaRepository.saveAll(notas);
    }
}