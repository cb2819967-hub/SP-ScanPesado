package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "regiones")
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_region")
    private Long id;

    @Column(name = "nombre_region", nullable = false)
    private String nombreRegion;

    private Boolean activo = true;
}
