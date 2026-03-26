package com.scanpesado.backend.dto;
import lombok.Data;

@Data // Si usas Lombok. Si no, genera los Getters y Setters a mano.
public class StatsDto {
    private long clientes;
    private long vehiculos;
    private long notas;
    private long verificaciones;

    // Nuevas para la gráfica:
    private long aprobadas;
    private long reprobadas;
    private long pendientes;
}