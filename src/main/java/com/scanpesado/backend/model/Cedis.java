package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cedis")
public class Cedis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cedis")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    private String nombre;
    private String direccion;
    private String encargado;
    private String correo;
    private String telefono;
    
    @Column(name = "tel_alternativo")
    private String telAlternativo;

    private Boolean activo = true;
}
