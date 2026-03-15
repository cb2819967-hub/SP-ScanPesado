package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Cedis;
import com.scanpesado.backend.repository.CedisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CedisService {
    @Autowired
    private CedisRepository cedisRepository;

    public List<Cedis> getAllCedis() {
        return cedisRepository.findByActivoTrue();
    }

    public Cedis saveCedis(Cedis cedis) {
        return cedisRepository.save(cedis);
    }
}
