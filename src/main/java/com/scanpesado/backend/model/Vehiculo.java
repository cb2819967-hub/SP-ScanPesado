package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vehiculos")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_cedis")
    private Cedis cedis;

    @Column(unique = true, nullable = false)
    private String placa;

    @Column(unique = true, nullable = false)
    private String serie;

    private String tipo;
    private Boolean activo = true;
}