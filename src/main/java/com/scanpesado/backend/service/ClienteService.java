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

    public List<Cliente> getAllClientes() {
        return clienteRepository.findByActivoTrue();
    }
    
    public Cliente saveCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}
