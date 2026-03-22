-- ═══════════════════════════════════════════════════════════════
-- SCRIPT PARA LIMPIAR Y RESETEAR LA BASE DE DATOS
-- Esto eliminará todos los datos y reseteará los AUTO_INCREMENT
-- ═══════════════════════════════════════════════════════════════

USE SP;

-- Desactivar chequeo de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS=0;

-- Limpiar todas las tablas
TRUNCATE TABLE evidencias_evaluacion;
TRUNCATE TABLE evaluaciones;
TRUNCATE TABLE verificaciones;
TRUNCATE TABLE notas;
TRUNCATE TABLE costos;
TRUNCATE TABLE verificentros;
TRUNCATE TABLE vehiculos;
TRUNCATE TABLE cedis;
TRUNCATE TABLE clientes;
TRUNCATE TABLE regiones;
TRUNCATE TABLE usuarios;

-- Reactivar chequeo de claves foráneas
SET FOREIGN_KEY_CHECKS=1;

-- ═══════════════════════════════════════════════════════════════
-- REINSERTAR DATOS INICIALES CON IDs CONSECUTIVOS
-- ═══════════════════════════════════════════════════════════════

-- 1. USUARIOS - Con IDs consecutivos (1, 2, 3...)
INSERT INTO usuarios (id_usuario, nombre_usuario, email, contrasena, tipo_usuario, activo)
VALUES
(1, 'Administrador', 'admin@scanpesado.com', 'admin123', 'ADMIN', 1),
(2, 'Carlos', 'carlos@scanpesado.com', 'admin123', 'ADMIN', 1);

-- Resetear el AUTO_INCREMENT para usuarios
ALTER TABLE usuarios AUTO_INCREMENT = 3;

-- 2. REGIONES
INSERT INTO regiones (nombre_region, activo)
VALUES
('Noreste', 1),
('Centro', 1),
('Occidente', 1);

-- 3. CLIENTES
INSERT INTO clientes (razon_social, email, telefono, activo)
VALUES
('Transportes del Norte S.A.', 'contacto@tdnorte.mx', '812-555-0001', 1),
('Logística Integral México', 'info@logistica-mx.com', '55-888-4422', 1);

-- 4. CEDIS
INSERT INTO cedis (id_cliente, id_region, nombre, direccion, encargado, correo, telefono, activo)
VALUES
(1, 1, 'CEDIS Norte MTY', 'Av. Industrial 420', 'Luis Herrera', 'cedis@tdnorte.mx', '812-555-1234', 1),
(2, 2, 'CEDIS Centro CDMX', 'Blvd. Eje Central 88', 'Patricia Ruiz', 'cedis@logistica-mx.com', '55-444-7788', 1);

-- 5. VEHICULOS
INSERT INTO vehiculos (id_cliente, id_cedis, placa, serie, tipo, activo)
VALUES
(1, 1, 'ABC-1234', 'VIN001', 'CAMION RABON (4x2) DOBLE RODADA TRASERA', 1),
(2, 2, 'XYZ-5678', 'VIN002', 'CAMION RABON (4x2) DOBLE RODADA TRASERA', 1);

-- 6. VERIFICENTROS
INSERT INTO verificentros (id_region, nombre, clave_verificentro, direccion, responsable, correo, telefono, activo)
VALUES
(1, 'Verificentro Norte 01', 'VN-001', 'Av. Industrial 420, MTY', 'Roberto Salas', 'norte@verificentro.mx', '812-555-1234', 1),
(2, 'Verificentro Centro 02', 'VC-002', 'Blvd. Eje Central 88, CDMX', 'Elena Ríos', 'centro@verificentro.mx', '55-444-7788', 1);

-- 7. NOTAS (Ejemplo)
INSERT INTO notas (id_cliente, id_verificentro, folio_nota, tipo_pago, anticipo, pagado_completo, atendio, reviso, activo)
VALUES
(1, 1, 'NT-001', 'EFECTIVO', 500.00, 0, 1, 2, 1);

-- 8. VERIFICACIONES
INSERT INTO verificaciones (id_nota, id_vehiculo, materia, precio, folio_verificacion, fecha_verificacion, dictamen, activo)
VALUES
(1, 1, 'MOTRIZ', 2100.00, 'V-2026-001', '2026-02-18', 'APROBADO', 1),
(1, 1, 'ARRASTRE', 1800.00, 'V-2026-002', '2026-02-18', 'APROBADO', 1);

-- ═══════════════════════════════════════════════════════════════
-- MENSAJE DE CONFIRMACIÓN
-- ═══════════════════════════════════════════════════════════════

SELECT 'Base de datos reseteada correctamente. ✅' AS mensaje;
SELECT COUNT(*) as total_usuarios FROM usuarios;

