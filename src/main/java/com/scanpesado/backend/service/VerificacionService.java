package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Verificacion;
import com.scanpesado.backend.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificacionService {
    @Autowired
    private VerificacionRepository verificacionRepository;

    public List<Verificacion> getRecentVerificaciones() {
        return verificacionRepository.findByActivoTrueOrderByFechaVerificacionDesc();
    }
}
