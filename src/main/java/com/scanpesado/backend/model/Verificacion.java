package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "verificaciones")
public class Verificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_verificacion")
    private Long id;

    // Simplified relation to Nota
    @Column(name = "id_nota")
    private Long idNota;

    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;

    @Enumerated(EnumType.STRING)
    private Materia materia;

    private Double precio;
    private Double multa = 0.0;

    @Column(name = "folio_verificacion")
    private String folioVerificacion;

    @Column(name = "fecha_verificacion")
    private LocalDate fechaVerificacion;

    @Enumerated(EnumType.STRING)
    private Dictamen dictamen;

    private Boolean activo = true;

    public enum Materia {
        MOTRIZ, ARRASTRE, GASOLINA, HUMO
    }
    
    public enum Dictamen {
        APROBADO, REPROBADO
    }
}
