package com.scanpesado.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "transacciones")
public class Transaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaccion")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_nota")
    private Nota nota;

    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;

    private String materia;
    private Double precio;

    @Column(name = "tipo_pago")
    private String tipoPago;

    private String cotizacion;
    private String folio;

    @Column(name = "fecha_folio")
    private LocalDate fechaFolio;

    @Column(name = "fecha_pedido")
    private LocalDate fechaPedido;

    @Column(name = "cuenta_deposito")
    private String cuentaDeposito;

    @Column(name = "numero_factura")
    private String numeroFactura;

    private Boolean pagado = false;
    private Boolean pendiente = true;
    private Boolean activo = true;
}