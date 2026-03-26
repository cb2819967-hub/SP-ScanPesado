package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Transaccion;
import com.scanpesado.backend.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransaccionService {

    @Autowired
    private TransaccionRepository repo;

    public List<Transaccion> getAllTransacciones() {
        return repo.findByActivoTrue();
    }

    public Transaccion saveTransaccion(Transaccion transaccion) {
        return repo.save(transaccion);
    }

    public void pagarMasivo(List<Long> ids) {
        List<Transaccion> transacciones = repo.findAllById(ids);
        transacciones.forEach(transaccion -> {
            transaccion.setPagado(true);
            transaccion.setPendiente(false);
        });
        repo.saveAll(transacciones);
    }

    public void eliminarMasivo(List<Long> ids) {
        List<Transaccion> transacciones = repo.findAllById(ids);
        transacciones.forEach(transaccion -> transaccion.setActivo(false));
        repo.saveAll(transacciones);
    }

    public void deleteTransaccion(Long id) {
        repo.findById(id).ifPresent(transaccion -> {
            transaccion.setActivo(false);
            repo.save(transaccion);
        });
    }
}
