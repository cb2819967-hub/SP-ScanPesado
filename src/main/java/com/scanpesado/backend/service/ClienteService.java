package com.scanpesado.backend.service;

import com.scanpesado.backend.model.Cliente;
import com.scanpesado.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Modificado para traer TODOS los clientes (activos e inactivos)
    // Así el frontend puede usar sus propios filtros.
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    public Cliente saveCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Borrado lógico: Solo cambia el estatus a falso, no borra de la BD
    public void deleteCliente(Long id) {
        clienteRepository.findById(id).ifPresent(cliente -> {
            cliente.setActivo(false);
            clienteRepository.save(cliente);
        });
    }
}