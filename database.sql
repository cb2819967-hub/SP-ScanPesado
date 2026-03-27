-- 1. REGIONES (Agrupamos las zonas solicitadas)
INSERT INTO regiones (activo, nombre_region) VALUES
                                                 (1, 'Norte'),
                                                 (1, 'Centro'),
                                                 (1, 'Sur');

-- 2. USUARIOS (Añadimos un par de técnicos para operar los verificentros)
INSERT INTO usuarios (activo, nombre_usuario, email, contrasena, tipo_usuario) VALUES
                                                                                   (1, 'Carlos Barrera', 'carlos@scanpesado.com', 'admin123', 'ADMIN'),
                                                                                   (1, 'Kioga Lee', 'kioga@scanpesado.com', 'admin123', 'ADMIN'),
                                                                                   (1, 'Carlos Daniel', 'carlos.d@scanpesado.com', 'tecnico123', 'TECNICO');

-- 3. CLIENTES (Empresas de transporte ficticias)
INSERT INTO clientes (activo, razon_social, rfc, email, telefono, gestor) VALUES
                                                                              (1, 'Transportes Regios S.A. de C.V.', 'TRE123456789', 'contacto@transregios.com', '8112345678', 'Roberto Garza'),
                                                                              (1, 'Logística Central MX', 'LCM987654321', 'operaciones@logcentral.com.mx', '5512345678', 'Ana Martínez'),
                                                                              (1, 'Fletes del Sur', 'FDS112233445', 'info@fletessur.com', '9512345678', 'Carlos Ruiz');

-- 4. CEDIS (Distribuidos en los estados que pediste)
INSERT INTO cedis (activo, id_cliente, id_region, nombre, direccion, encargado, telefono) VALUES
                                                                                              (1, 1, 1, 'CEDIS Monterrey', 'Av. Ruiz Cortines 123, Monterrey, N.L.', 'Luis Hernández', '8187654321'),
                                                                                              (1, 2, 2, 'CEDIS Vallejo', 'Poniente 128, Azcapotzalco, CDMX', 'Pedro Jiménez', '5551234567'),
                                                                                              (1, 2, 2, 'CEDIS Toluca', 'Blvd. Aeropuerto 456, Toluca, Estado de México', 'Diana Sofía', '7221234567'),
                                                                                              (1, 2, 2, 'CEDIS Cuernavaca', 'Av. Plan de Ayala 789, Cuernavaca, Morelos', 'Jorge Gómez', '7771234567'),
                                                                                              (1, 3, 3, 'CEDIS Oaxaca Centro', 'Periférico Sur 101, Oaxaca de Juárez, Oaxaca', 'Marta Flores', '9511234567');

-- 5. VEHÍCULOS (Asignados a los CEDIS anteriores)
INSERT INTO vehiculos (activo, id_cliente, id_cedis, placa, serie, tipo) VALUES
                                                                             (1, 1, 1, 'RJ-12-345', 'VIN1234567890NORT1', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                             (1, 2, 2, 'LE-98-765', 'VIN0987654321CENT1', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                             (1, 2, 3, 'LE-11-222', 'VIN1122334455CENT2', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                             (1, 2, 4, 'LE-33-444', 'VIN5566778899CENT3', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                             (1, 3, 5, 'OX-55-666', 'VIN9988776655SUR01', 'CAMION RABON (4x2) DOBLE RODADA TRASERA');

-- 6. VERIFICENTROS (Ubicaciones físicas en los estados solicitados)
INSERT INTO verificentros (activo, id_region, nombre, clave_verificentro, direccion, responsable, horario) VALUES
                                                                                                               (1, 1, 'Verificentro Monterrey Norte', 'VN-MTY-01', 'Av. Universidad 404, San Nicolás de los Garza, N.L.', 'Héctor Salinas', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                               (1, 2, 'Verificentro CDMX Iztapalapa', 'VC-CDMX-05', 'Eje 5 Sur 100, Iztapalapa, CDMX', 'Carmen Vega', 'L-V 8:00 a 20:00, S 8:00 a 15:00'),
                                                                                                               (1, 2, 'Verificentro Edomex Tlalnepantla', 'VC-EDO-12', 'Vía Gustavo Baz 200, Tlalnepantla, Estado de México', 'Ricardo Soto', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                               (1, 2, 'Verificentro Morelos Jiutepec', 'VC-MOR-03', 'Carr. Cuernavaca-Cuautla Km 5, Jiutepec, Morelos', 'Laura Medina', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                               (1, 3, 'Verificentro Oaxaca Valles', 'VS-OAX-01', 'Símbolos Patrios 500, Oaxaca, Oaxaca', 'Raúl Castro', 'L-V 8:00 a 17:00, S 8:00 a 13:00');

-- 7. COSTOS (Tarifas acordadas con cada cliente)
INSERT INTO costos (activo, id_cliente, atiende_y_cobra, encargado, materia, costo) VALUES
                                                                                        (1, 1, 'Gestoría Interna', 'Roberto Garza', 'MOTRIZ', 1800.00),
                                                                                        (1, 2, 'Gestoría Externa', 'Ana Martínez', 'HUMO', 950.00),
                                                                                        (1, 3, 'Gestoría Interna', 'Carlos Ruiz', 'MOTRIZ', 1750.00);

-- 8. NOTAS (Órdenes de servicio generadas para los clientes en los verificentros)
-- Relaciones: Cliente 1 en Monterrey (Verificentro 1), Cliente 2 en CDMX (Verificentro 2), Cliente 3 en Oaxaca (Verificentro 5)
INSERT INTO notas (activo, id_cliente, id_verificentro, folio, fecha_creacion, fecha_contrato, fecha_vigencia, anticipo, pagado_completo, atendio, reviso, tipo_pago, comentario) VALUES
                                                                                                                                                                                      (1, 1, 1, 'NOT-NTE-001', '2026-03-20', '2026-03-21', '2026-04-20', 500.00, 0, 'Kioga Lee', 'Admin', 'Transferencia', 'Urgente para flotilla Monterrey'),
                                                                                                                                                                                      (1, 2, 2, 'NOT-CEN-001', '2026-03-22', '2026-03-22', '2026-04-22', 950.00, 1, 'Carlos Daniel', 'Admin', 'Efectivo', 'Pago completo en sucursal CDMX'),
                                                                                                                                                                                      (1, 3, 5, 'NOT-SUR-001', '2026-03-25', '2026-03-25', '2026-04-25', 0.00, 0, 'Kioga Lee', 'Admin', 'Crédito', 'Pendiente de anticipo Fletes del Sur');

-- 9. PEDIDOS (Logística de envío de hologramas o documentos asociados a las notas)
-- Estatus permitidos: 'PENDIENTE','ENVIADO','ENTREGADO','INCIDENCIA'
INSERT INTO pedidos (activo, id_nota, estatus_envio, fecha_envio, numero_guia, recibio, foto, comentario) VALUES
                                                                                                              (1, 1, 'ENVIADO', '2026-03-22', 'DHL-12345678', NULL, NULL, 'Documentación en tránsito a Monterrey'),
                                                                                                              (1, 2, 'ENTREGADO', '2026-03-24', 'FEDEX-987654', 'Pedro Jiménez', 'evidencia_cdmx.jpg', 'Entregado a encargado del CEDIS Vallejo'),
                                                                                                              (1, 3, 'PENDIENTE', NULL, NULL, NULL, NULL, 'Esperando recolección para Oaxaca');

-- 10. TRANSACCIONES (Control financiero por vehículo y nota)
-- Vehículo 1 (Regios), Vehículo 2 (Logística Central), Vehículo 5 (Fletes del Sur)
INSERT INTO transacciones (activo, id_nota, id_vehiculo, folio, fecha_folio, fecha_pedido, cotizacion, numero_factura, materia, precio, pagado, pendiente, tipo_pago, cuenta_deposito) VALUES
                                                                                                                                                                                           (1, 1, 1, 'TR-001', '2026-03-21', '2026-03-20', 'COT-NTE-100', 'FAC-A001', 'MOTRIZ', 1800.00, 0, 1, 'Transferencia', '0987654321 Banorte'),
                                                                                                                                                                                           (1, 2, 2, 'TR-002', '2026-03-22', '2026-03-22', 'COT-CEN-101', 'FAC-A002', 'HUMO', 950.00, 1, 0, 'Efectivo', 'Caja General CDMX'),
                                                                                                                                                                                           (1, 3, 5, 'TR-003', '2026-03-25', '2026-03-25', 'COT-SUR-102', 'FAC-A003', 'MOTRIZ', 1750.00, 0, 1, 'Crédito', 'Pendiente');

-- 11. VERIFICACIONES (Resultados del proceso en el verificentro)
-- Materias: 'MOTRIZ','ARRASTRE','GASOLINA','HUMO' | Dictamen: 'APROBADO','PENDIENTE','REPROBADO'
INSERT INTO verificaciones (activo, id_nota, id_vehiculo, folio_verificacion, fecha_verificacion, materia, dictamen, precio, multa) VALUES
                                                                                                                                        (1, 1, 1, 'VER-FOL-001', '2026-03-23', 'MOTRIZ', 'PENDIENTE', 1800.00, 0.00),
                                                                                                                                        (1, 2, 2, 'VER-FOL-002', '2026-03-24', 'HUMO', 'APROBADO', 950.00, 0.00),
                                                                                                                                        (1, 3, 5, 'VER-FOL-003', '2026-03-26', 'MOTRIZ', 'REPROBADO', 1750.00, 150.00);

-- 12. EVALUACIONES (Detalle técnico de la verificación)
-- Nota: Asumo que "Kioga" tomó el ID 4 y "Carlos Daniel" el ID 5 según tu script de usuarios.
INSERT INTO evaluaciones (id_verificacion, id_tecnico, fecha_captura, luces_altas, presion_izq_del, comentarios) VALUES
                                                                                                                     (1, 4, '2026-03-23 10:00:00', 'Regulares', 32, 'Falta ajuste en frenos traseros, se deja en PENDIENTE'),
                                                                                                                     (2, 5, '2026-03-24 11:30:00', 'Óptimas', 35, 'Niveles de opacidad de humo dentro de norma, APROBADO'),
                                                                                                                     (3, 4, '2026-03-26 09:15:00', 'Deficientes', 28, 'Falla en sistema de escape y baja presión de llantas, REPROBADO');
