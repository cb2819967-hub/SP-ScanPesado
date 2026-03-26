package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Costo;
import com.scanpesado.backend.repository.CostoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CostoService {
    @Autowired
    private CostoRepository costoRepository;

    public List<Costo> getAllCostos() {
        return costoRepository.findAll();
    }

    public Costo saveCosto(Costo costo) {
        return costoRepository.save(costo);
    }

    public void deleteCosto(Long id) {
        costoRepository.findById(id).ifPresent(c -> {
            c.setActivo(false);
            costoRepository.save(c);
        });
    }
}