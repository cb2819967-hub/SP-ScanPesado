package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data // Si no usas Lombok, genera getters y setters
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con la Nota
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_nota", nullable = false)
    private Nota nota;

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;

    @Column(name = "numero_guia", length = 100)
    private String numeroGuia;

    @Column(name = "recibio", length = 100)
    private String recibio;

    // Guardaremos la ruta o nombre de la foto (por ahora texto)
    @Column(name = "foto")
    private String foto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estatus_envio", length = 20)
    private EstatusEnvio estatusEnvio = EstatusEnvio.PENDIENTE;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    public enum EstatusEnvio {
        PENDIENTE, ENVIADO, ENTREGADO, INCIDENCIA
    }
}