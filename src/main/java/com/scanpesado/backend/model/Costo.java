package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "costos")
public class Costo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_costo")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    private String materia;
    private Double costo;
    private String encargado;

    @Column(name = "atiende_y_cobra")
    private String atiendeYCobra;

    private Boolean activo = true;
}