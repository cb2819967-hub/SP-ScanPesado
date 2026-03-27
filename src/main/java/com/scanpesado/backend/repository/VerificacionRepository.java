package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    List<Verificacion> findByActivoTrueOrderByFechaVerificacionDesc();

    // 🟢 AQUÍ ESTÁ EL CAMBIO: findByNotaId en lugar de findByIdNota
    List<Verificacion> findByNotaIdAndActivoTrue(Long idNota);
    List<Verificacion> findByVehiculoIdAndActivoTrueOrderByFechaVerificacionDesc(Long idVehiculo);

    // Las instrucciones de conteo para el Dashboard:
    long countByActivoTrue();

    // Corregimos el parámetro a Verificacion.Dictamen para evitar el error de Hibernate
    long countByDictamenAndActivoTrue(Verificacion.Dictamen dictamen);
}
