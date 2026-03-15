package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Vehiculo;
import com.scanpesado.backend.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehiculoService {
    @Autowired
    private VehiculoRepository vehiculoRepository;

    public List<Vehiculo> getAllVehiculos() {
        return vehiculoRepository.findByActivoTrue();
    }

    public Vehiculo saveVehiculo(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }
}
