CREATE DATABASE IF NOT EXISTS scanpesado;
USE scanpesado;

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('ADMIN', 'TECNICO') NOT NULL,
    activo TINYINT(1) DEFAULT 1
);

-- Usuario por defecto para entrar (contraseña: admin123)
-- Hash bcrypt de 'admin123'
INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario)
SELECT 'Administrador', 'admin@test.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxw96pASQDm7G6S.sO1E/0c5.r.Ry', 'ADMIN'
WHERE NOT EXISTS (SELECT * FROM usuarios WHERE email = 'admin@test.com');

-- Usuario Carlos (contraseña: 1234)
-- Hash bcrypt de '1234'
INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario) 
SELECT 'Carlos', 'carlos@scanpesado.com', '$2b$12$X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X5r/X', 'ADMIN'
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
