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

    // Cambiado a findAll() para que el frontend filtre
    public List<Vehiculo> getAllVehiculos() {
        return vehiculoRepository.findAll();
    }

    public Vehiculo saveVehiculo(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    // Borrado lógico
    public void deleteVehiculo(Long id) {
        vehiculoRepository.findById(id).ifPresent(vehiculo -> {
            vehiculo.setActivo(false);
            vehiculoRepository.save(vehiculo);
        });
    }
}