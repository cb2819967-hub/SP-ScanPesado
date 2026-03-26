CREATE DATABASE IF NOT EXISTS SP;
USE SP;


-- 1. Quitamos el candado de la llave foránea de reviso (casi siempre es el 4)
ALTER TABLE notas DROP FOREIGN KEY notas_ibfk_4;
select * from usuarios;

-- 2. Cambiamos la columna a texto
ALTER TABLE notas MODIFY COLUMN reviso VARCHAR(100);

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('ADMIN', 'TECNICO') NOT NULL,
    activo TINYINT(1) DEFAULT 1
);
select * from verificentros;
-- Revisa que existan estas columnas con estos nombres exactos:
-- clave_verificentro
-- correo
-- telefono
-- tel_alternativo
-- horario

-- Si te falta alguna, puedes agregarla corriendo un comando como este:
INSERT IGNORE INTO regiones (id_region, nombre_region, activo)
VALUES (1, 'Noreste', 1);
ALTER TABLE verificentros MODIFY COLUMN horario VARCHAR(255);
INSERT INTO verificentros (
    id_region,
    nombre,
    clave_verificentro,
    direccion,
    responsable,
    correo,
    telefono,
    tel_alternativo,
    horario,
    activo
) VALUES (
             1,
             'Verificentro MTY Centro',
             'VN-001',
             'Av. Universidad 123, San Nicolás, N.L.',
             'Roberto Gómez',
             'roberto@verifmty.com',
             '8112345678',
             '8119876543',
             'L-V 8:00 a 18:00, S 8:00 a 14:00',
             1
         );
INSERT INTO regiones (nombre_region, activo) VALUES ('Noreste', 1), ('Centro', 1), ('Occidente', 1);
ALTER TABLE clientes ADD COLUMN rfc VARCHAR(20) AFTER razon_social;
-- Usuario por defecto para entrar (contraseña: admin123)
-- Hash bcrypt de 'admin123'
INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario)
SELECT 'Administrador', 'admin@scanpesado.com', 'admin123', 'ADMIN'
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE email = 'admin@scanpesado.com');

-- Usuario Carlos (contraseña: 1234)
-- Hash bcrypt de '1234'
INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario) 
SELECT 'Carlos', 'carlos@scanpesado.com', 'admin123', 'ADMIN'
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE email = 'carlos@scanpesado.com');

-- 2. REGIONES
CREATE TABLE IF NOT EXISTS regiones (
    id_region INT AUTO_INCREMENT PRIMARY KEY,
    nombre_region VARCHAR(100) NOT NULL,
    activo TINYINT(1) DEFAULT 1
);

-- 3. CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    telefono_alternativo VARCHAR(20),
    gestor VARCHAR(100),
    activo TINYINT(1) DEFAULT 1
);

-- 4. CEDIS
CREATE TABLE IF NOT EXISTS cedis (
    id_cedis INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_region INT,
    nombre VARCHAR(100),
    direccion VARCHAR(255),
    encargado VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    tel_alternativo VARCHAR(20),
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_region) REFERENCES regiones(id_region)
);

-- 5. VEHICULOS
CREATE TABLE IF NOT EXISTS vehiculos (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_cedis INT,
    placa VARCHAR(20) UNIQUE NOT NULL,
    serie VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) DEFAULT 'CAMION RABON (4x2) DOBLE RODADA TRASERA',
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_cedis) REFERENCES cedis(id_cedis)
);

-- 6. VERIFICENTROS
CREATE TABLE IF NOT EXISTS verificentros (
    id_verificentro INT AUTO_INCREMENT PRIMARY KEY,
    id_region INT,
    nombre VARCHAR(100),
    clave_verificentro VARCHAR(50),
    direccion VARCHAR(255),
    responsable VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    tel_alternativo VARCHAR(20),
    horario JSON,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_region) REFERENCES regiones(id_region)
);

-- 7. COSTOS POR CLIENTE
CREATE TABLE IF NOT EXISTS costos (
    id_costo INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    materia ENUM('MOTRIZ', 'ARRASTRE', 'GASOLINA', 'HUMO'),
    costo DECIMAL(10,2),
    id_encargado INT,
    id_atencion_cobro INT,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_encargado) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_atencion_cobro) REFERENCES usuarios(id_usuario)
);

-- 8. NOTAS
CREATE TABLE IF NOT EXISTS notas (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_verificentro INT,
    folio_nota VARCHAR(50) UNIQUE,
    tipo_pago ENUM('EFECTIVO', 'DEPOSITO', 'TRANSFERENCIA', 'TARJETA'),
    anticipo DECIMAL(10,2) DEFAULT 0,
    pagado_completo TINYINT(1) DEFAULT 0,
    atendio INT,
    reviso INT,
    comentario VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_verificentro) REFERENCES verificentros(id_verificentro),
    FOREIGN KEY (atendio) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (reviso) REFERENCES usuarios(id_usuario)
);

-- 9. VERIFICACIONES (Detalle de la Nota)
CREATE TABLE IF NOT EXISTS verificaciones (
    id_verificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_nota INT,
    id_vehiculo INT,
    materia ENUM('MOTRIZ', 'ARRASTRE', 'GASOLINA', 'HUMO'),
    precio DECIMAL(10,2),
    multa DECIMAL(10,2) DEFAULT 0,
    folio_verificacion VARCHAR(50),
    fecha_verificacion DATE, 
    dictamen ENUM('APROBADO', 'REPROBADO'), 
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_nota) REFERENCES notas(id_nota),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);

-- 12. EVALUACIONES (Solo los datos puros, sin fotos)
CREATE TABLE IF NOT EXISTS evaluaciones (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_verificacion INT,
    id_tecnico INT,
    -- [Campos abreviados para el ejemplo, pero en tu BD real pon todos los que me pasaste]
    comentarios TEXT,
    fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_verificacion) REFERENCES verificaciones(id_verificacion),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id_usuario)
);

-- 13. EVIDENCIAS POR CAMPO
CREATE TABLE IF NOT EXISTS evidencias_evaluacion (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_evaluacion INT,
    campo_evaluado VARCHAR(100) NOT NULL,
    foto LONGBLOB NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones(id_evaluacion) ON DELETE CASCADE
);

-- 1. Desactivamos la revisión de llaves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Vaciamos todas las tablas (el orden ya no importa gracias al paso 1)
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

-- 3. Volvemos a activar la revisión de llaves foráneas (¡Muy importante!)
SET FOREIGN_KEY_CHECKS = 1;

-- 1. REGIONES (Agrupamos las zonas solicitadas)
INSERT INTO regiones (nombre_region, activo) VALUES
                                                 ('Norte (Nuevo León)', 1),
                                                 ('Centro (CDMX, Edomex, Morelos)', 1),
                                                 ('Sur (Oaxaca)', 1);

-- 2. USUARIOS (Añadimos un par de técnicos para operar los verificentros)
INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario) VALUES
                                                                           ('Kioga Lee', 'kioga@scanpesado.com', 'admin123', 'ADMIN'),
                                                                           ('Carlos Daniel', 'carlos.d@scanpesado.com', 'tecnico123', 'TECNICO');

-- 3. CLIENTES (Empresas de transporte ficticias)
INSERT INTO clientes (razon_social, rfc, email, telefono, gestor) VALUES
                                                                      ('Transportes Regios S.A. de C.V.', 'TRE123456789', 'contacto@transregios.com', '8112345678', 'Roberto Garza'),
                                                                      ('Logística Central MX', 'LCM987654321', 'operaciones@logcentral.com.mx', '5512345678', 'Ana Martínez'),
                                                                      ('Fletes del Sur', 'FDS112233445', 'info@fletessur.com', '9512345678', 'Carlos Ruiz');

-- 4. CEDIS (Distribuidos en los estados que pediste)
-- Asumiendo que: ID 1=Norte, ID 2=Centro, ID 3=Sur
-- Asumiendo que: ID 1=Transp. Regios, ID 2=Logística Central, ID 3=Fletes Sur
INSERT INTO cedis (id_cliente, id_region, nombre, direccion, encargado, telefono) VALUES
                                                                                      (1, 1, 'CEDIS Monterrey', 'Av. Ruiz Cortines 123, Monterrey, N.L.', 'Luis Hernández', '8187654321'),
                                                                                      (2, 2, 'CEDIS Vallejo', 'Poniente 128, Azcapotzalco, CDMX', 'Pedro Jiménez', '5551234567'),
                                                                                      (2, 2, 'CEDIS Toluca', 'Blvd. Aeropuerto 456, Toluca, Estado de México', 'Diana Sofía', '7221234567'),
                                                                                      (2, 2, 'CEDIS Cuernavaca', 'Av. Plan de Ayala 789, Cuernavaca, Morelos', 'Jorge Gómez', '7771234567'),
                                                                                      (3, 3, 'CEDIS Oaxaca Centro', 'Periférico Sur 101, Oaxaca de Juárez, Oaxaca', 'Marta Flores', '9511234567');

-- 5. VEHÍCULOS (Asignados a los CEDIS anteriores)
INSERT INTO vehiculos (id_cliente, id_cedis, placa, serie, tipo) VALUES
                                                                     (1, 1, 'RJ-12-345', 'VIN1234567890NORT1', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                     (2, 2, 'LE-98-765', 'VIN0987654321CENT1', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                     (2, 3, 'LE-11-222', 'VIN1122334455CENT2', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                     (2, 4, 'LE-33-444', 'VIN5566778899CENT3', 'CAMION RABON (4x2) DOBLE RODADA TRASERA'),
                                                                     (3, 5, 'OX-55-666', 'VIN9988776655SUR01', 'CAMION RABON (4x2) DOBLE RODADA TRASERA');

-- 6. VERIFICENTROS (Ubicaciones físicas en los estados solicitados)
INSERT INTO verificentros (id_region, nombre, clave_verificentro, direccion, responsable, horario) VALUES
                                                                                                       (1, 'Verificentro Monterrey Norte', 'VN-MTY-01', 'Av. Universidad 404, San Nicolás de los Garza, N.L.', 'Héctor Salinas', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                       (2, 'Verificentro CDMX Iztapalapa', 'VC-CDMX-05', 'Eje 5 Sur 100, Iztapalapa, CDMX', 'Carmen Vega', 'L-V 8:00 a 20:00, S 8:00 a 15:00'),
                                                                                                       (2, 'Verificentro Edomex Tlalnepantla', 'VC-EDO-12', 'Vía Gustavo Baz 200, Tlalnepantla, Estado de México', 'Ricardo Soto', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                       (2, 'Verificentro Morelos Jiutepec', 'VC-MOR-03', 'Carr. Cuernavaca-Cuautla Km 5, Jiutepec, Morelos', 'Laura Medina', 'L-V 8:00 a 18:00, S 8:00 a 14:00'),
                                                                                                       (3, 'Verificentro Oaxaca Valles', 'VS-OAX-01', 'Símbolos Patrios 500, Oaxaca, Oaxaca', 'Raúl Castro', 'L-V 8:00 a 17:00, S 8:00 a 13:00');

ALTER TABLE costos
-- Cambiamos id_encargado a encargado (texto)
    CHANGE COLUMN id_encargado encargado VARCHAR(100),

-- Cambiamos id_atencion_cobro a atiende_y_cobra (texto)
    CHANGE COLUMN id_atencion_cobro atiende_y_cobra VARCHAR(100),

-- Relajamos el ENUM a VARCHAR para que Java no tenga problemas
    MODIFY COLUMN materia VARCHAR(50);


DROP TABLE IF EXISTS transacciones;
ALTER TABLE notas ADD COLUMN fecha_creacion DATE;
CREATE TABLE transacciones (
                               id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
                               id_nota INT,
                               id_vehiculo INT,
                               materia VARCHAR(50),
                               precio DOUBLE,
                               tipo_pago VARCHAR(50),
                               cotizacion VARCHAR(100),
                               folio VARCHAR(100),
                               fecha_folio DATE,
                               fecha_pedido DATE,
                               cuenta_deposito VARCHAR(100),
                               numero_factura VARCHAR(100),
                               pagado TINYINT(1) DEFAULT 0,
                               pendiente TINYINT(1) DEFAULT 1,
                               activo TINYINT(1) DEFAULT 1,

                               FOREIGN KEY (id_nota) REFERENCES notas(id_nota),
                               FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);
CREATE TABLE pedidos (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         id_nota INT NOT NULL,
                         fecha_envio DATE,
                         numero_guia VARCHAR(100),
                         recibio VARCHAR(100),
                         foto VARCHAR(255),
                         estatus_envio VARCHAR(20) DEFAULT 'PENDIENTE',
                         comentario TEXT,
                         activo BOOLEAN NOT NULL DEFAULT TRUE,
                         FOREIGN KEY (id_nota) REFERENCES notas(id_nota) /* ⬅️ ¡CORRECCIÓN AQUÍ! */
);

UPDATE regiones SET nombre_region = 'Norte' WHERE nombre_region LIKE 'Norte%';
UPDATE regiones SET nombre_region = 'Centro' WHERE nombre_region LIKE 'Centro%';
UPDATE regiones SET nombre_region = 'Sur' WHERE nombre_region LIKE 'Sur%';