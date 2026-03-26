package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "notas")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota")
    private Long id;

    @Column(nullable = false, unique = true)
    private String folio;

    @Column(name = "fecha_creacion")
    private java.time.LocalDate fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_verificentro")
    private Verificentro verificentro;

    @Column(name = "tipo_pago")
    private String tipoPago;

    private Double anticipo;

    @Column(name = "pagado_completo")
    private Boolean pagadoCompleto;

    private String atendio;
    private String reviso;
    private String comentario;

    @Column(name = "fecha_contrato")
    private LocalDate fechaContrato;

    @Column(name = "fecha_vigencia")
    private LocalDate fechaVigencia;

    private Boolean activo = true;

    // Se asignan fechas automáticamente antes de guardar en la BD
    @PrePersist
    protected void onCreate() {
        this.fechaContrato = LocalDate.now();
        this.fechaVigencia = LocalDate.now().plusYears(1);
    }
}