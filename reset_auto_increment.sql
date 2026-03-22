-- ═══════════════════════════════════════════════════════════════
-- SCRIPT PARA RESETEAR SOLO LOS AUTO_INCREMENT
-- Sin eliminar datos (alternativa más segura)
-- ═══════════════════════════════════════════════════════════════

USE SP;

-- Desactivar chequeo de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS=0;

-- ═══════════════════════════════════════════════════════════════
-- RESETEAR AUTO_INCREMENT PARA CADA TABLA
-- ═══════════════════════════════════════════════════════════════

-- Obtener el máximo ID de cada tabla y resetear AUTO_INCREMENT

-- Usuarios
SET @max_usuario = IFNULL((SELECT MAX(id_usuario) FROM usuarios), 0);
SET @next_usuario = @max_usuario + 1;
ALTER TABLE usuarios AUTO_INCREMENT = @next_usuario;

-- Regiones
SET @max_region = IFNULL((SELECT MAX(id_region) FROM regiones), 0);
SET @next_region = @max_region + 1;
ALTER TABLE regiones AUTO_INCREMENT = @next_region;

-- Clientes
SET @max_cliente = IFNULL((SELECT MAX(id_cliente) FROM clientes), 0);
SET @next_cliente = @max_cliente + 1;
ALTER TABLE clientes AUTO_INCREMENT = @next_cliente;

-- CEDIS
SET @max_cedis = IFNULL((SELECT MAX(id_cedis) FROM cedis), 0);
SET @next_cedis = @max_cedis + 1;
ALTER TABLE cedis AUTO_INCREMENT = @next_cedis;

-- Vehículos
SET @max_vehiculo = IFNULL((SELECT MAX(id_vehiculo) FROM vehiculos), 0);
SET @next_vehiculo = @max_vehiculo + 1;
ALTER TABLE vehiculos AUTO_INCREMENT = @next_vehiculo;

-- Verificentros
SET @max_verificentro = IFNULL((SELECT MAX(id_verificentro) FROM verificentros), 0);
SET @next_verificentro = @max_verificentro + 1;
ALTER TABLE verificentros AUTO_INCREMENT = @next_verificentro;

-- Costos
SET @max_costo = IFNULL((SELECT MAX(id_costo) FROM costos), 0);
SET @next_costo = @max_costo + 1;
ALTER TABLE costos AUTO_INCREMENT = @next_costo;

-- Notas
SET @max_nota = IFNULL((SELECT MAX(id_nota) FROM notas), 0);
SET @next_nota = @max_nota + 1;
ALTER TABLE notas AUTO_INCREMENT = @next_nota;

-- Verificaciones
SET @max_verificacion = IFNULL((SELECT MAX(id_verificacion) FROM verificaciones), 0);
SET @next_verificacion = @max_verificacion + 1;
ALTER TABLE verificaciones AUTO_INCREMENT = @next_verificacion;

-- Evaluaciones
SET @max_evaluacion = IFNULL((SELECT MAX(id_evaluacion) FROM evaluaciones), 0);
SET @next_evaluacion = @max_evaluacion + 1;
ALTER TABLE evaluaciones AUTO_INCREMENT = @next_evaluacion;

-- Evidencias
SET @max_evidencia = IFNULL((SELECT MAX(id_evidencia) FROM evidencias_evaluacion), 0);
SET @next_evidencia = @max_evidencia + 1;
ALTER TABLE evidencias_evaluacion AUTO_INCREMENT = @next_evidencia;

-- Reactivar chequeo de claves foráneas
SET FOREIGN_KEY_CHECKS=1;

-- ═══════════════════════════════════════════════════════════════
-- MOSTRAR RESULTADO
-- ═══════════════════════════════════════════════════════════════

SELECT 'AUTO_INCREMENT reseteados correctamente ✅' AS resultado;
SELECT
  'Usuarios' as tabla,
  CONCAT(@next_usuario, ' (próximo ID)') as info
UNION ALL
SELECT
  'Clientes',
  CONCAT(@next_cliente, ' (próximo ID)')
UNION ALL
SELECT
  'Vehículos',
  CONCAT(@next_vehiculo, ' (próximo ID)');

