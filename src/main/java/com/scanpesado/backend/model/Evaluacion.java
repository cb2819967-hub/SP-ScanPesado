package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "evaluaciones")
public class Evaluacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long id;

    @Column(name = "id_verificacion")
    private Long idVerificacion;

    @Column(name = "id_tecnico")
    private Long idTecnico;

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_captura")
    private LocalDateTime fechaCaptura = LocalDateTime.now();

    // Fields for evaluation data (luces_altas, etc.) would go here matching the DB columns
    // The python code used a generic Pydantic model "DatosEvaluacion" 
    // If the table has specific columns for these, they should be mapped here.
    // Based on database.sql comment: "-- [Campos abreviados para el ejemplo...]"
    // I will add the ones mentioned in python: luces_altas, presion_izq_del
    
    @Column(name = "luces_altas")
    private String lucesAltas;

    @Column(name = "presion_izq_del")
    private Integer presionIzqDel;
}
