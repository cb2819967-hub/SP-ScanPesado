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

    public List<Verificentro> getAllVerificentros() {
        return verificentroRepository.findByActivoTrue();
    }

    public Verificentro saveVerificentro(Verificentro verificentro) {
        return verificentroRepository.save(verificentro);
    }
}
