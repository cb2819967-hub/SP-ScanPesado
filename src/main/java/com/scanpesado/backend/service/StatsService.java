package com.scanpesado.backend.service;

import com.scanpesado.backend.dto.StatsDto;
import com.scanpesado.backend.repository.ClienteRepository;
import com.scanpesado.backend.repository.NotaRepository;
import com.scanpesado.backend.repository.VehiculoRepository;
import com.scanpesado.backend.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Autowired
    private NotaRepository notaRepository;
    
    @Autowired
    private VerificacionRepository verificacionRepository;

    public StatsDto getStats() {
        StatsDto stats = new StatsDto();
        stats.setClientes(clienteRepository.countByActivoTrue());
        stats.setVehiculos(vehiculoRepository.countByActivoTrue());
        stats.setNotas(notaRepository.countByActivoTrue());
        stats.setVerificaciones(verificacionRepository.countByActivoTrue());
        return stats;
    }
}
