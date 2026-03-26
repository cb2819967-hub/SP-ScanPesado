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

    public List<Transaccion> getAllTransacciones() { return repo.findByActivoTrue(); }

    public Transaccion saveTransaccion(Transaccion t) { return repo.save(t); }

    // ACCIONES MASIVAS
    public void pagarMasivo(List<Long> ids) {
        List<Transaccion> trans = repo.findAllById(ids);
        trans.forEach(t -> {
            t.setPagado(true);
            t.setPendiente(false);
        });
        repo.saveAll(trans);
    }

    public void eliminarMasivo(List<Long> ids) {
        List<Transaccion> trans = repo.findAllById(ids);
        trans.forEach(t -> t.setActivo(false)); // Borrado Lógico
        repo.saveAll(trans);
    }
}