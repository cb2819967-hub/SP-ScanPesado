package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "verificentros")
public class Verificentro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_verificentro")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    private String nombre;
    
    @Column(name = "clave_verificentro")
    private String claveVerificentro;
    
    private String direccion;
    private String responsable;
    private String correo;
    private String telefono;
    
    @Column(name = "tel_alternativo")
    private String telAlternativo;
    
    private String horario; // Changed to String as JSON is tricky without specific mapping

    private Boolean activo = true;
}
