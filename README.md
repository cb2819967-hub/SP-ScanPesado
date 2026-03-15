# Scan Pesado — Backend

API REST para la gestión de verificaciones vehiculares y la operación diaria del sistema: autenticación de usuarios, administración de clientes, registro y consulta de verificaciones, y estadísticas para el dashboard. También soporta el flujo móvil de evaluaciones en campo.

## Funcionalidades clave
- Autenticación de usuarios (login).
- Gestión de usuarios y clientes.
- Verificaciones/inspecciones: creación y consulta de recientes.
- Estadísticas operativas para paneles.
- Soporte a evaluaciones móviles (inicio/actualización).

## Stack tecnológico
- Java 21
- Spring Web (MVC) y Spring Data JPA
- Jakarta (anotaciones)
- Lombok
- MySQL 8.x

## Requisitos previos
- Java 21 o superior
- Maven 3.8+ (o superior)
- MySQL en localhost:3306 (por defecto)

## Configuración
Define la conexión a base de datos y parámetros de la app en `src/main/resources/application.properties` o mediante variables de entorno equivalentes.

Ejemplo:

## Ejecución
Desde la raíz del proyecto:
```bash
mvn spring-boot:run
```

El servidor iniciará en `http://localhost:8080`.

## Endpoints Principales (Compatibilidad Frontend)
- `POST /api/login`: Autenticación de usuarios
- `GET /api/stats`: Estadísticas del dashboard
- `GET /api/clientes`: Listado de clientes
- `GET /api/usuarios`: Listado de usuarios
- `GET /api/verificaciones`: Listado de verificaciones recientes

## Estructura del Proyecto (Java)
- `src/main/java/com/scanpesado/backend/`: Código fuente Java
    - `controller/`: Controladores REST (Endpoints)
    - `model/`: Entidades JPA (Tablas de BD)
    - `repository/`: Interfaces de acceso a datos (Spring Data JPA)
    - `service/`: Lógica de negocio
- `pom.xml`: Dependencias Maven (Spring Boot, MySQL, Lombok, etc.)
