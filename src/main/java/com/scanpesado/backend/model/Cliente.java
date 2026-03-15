package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @Column(name = "razon_social", nullable = false)
    private String razonSocial;

    private String email;
    private String telefono;
    
    @Column(name = "telefono_alternativo")
    private String telefonoAlternativo;
    
    private String gestor;
    private Boolean activo = true;
}
