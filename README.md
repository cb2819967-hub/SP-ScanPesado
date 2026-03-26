# Scan Pesado

Aplicacion full stack con backend Spring Boot y frontend React para la gestion de verificaciones vehiculares, catalogos, finanzas y reportes.

## Stack
- Java 17+
- Spring Boot 3
- Spring Web MVC y Spring Data JPA
- MySQL 8.x
- React + Vite + React Router
- React Hook Form + Zod

## Requisitos
- Java 17 o superior
- Maven 3.8+ o wrapper Maven
- Node.js 20+ y npm
- MySQL en localhost:3306

## Desarrollo
Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
mvn spring-boot:run
```

## Build del frontend
```bash
cd frontend
npm run build
```

El build de React se publica en `src/main/resources/static` y Spring Boot lo sirve desde `http://localhost:8080`.

## Endpoints clave
- `POST /api/login`
- `GET /api/stats`
- `GET /api/clientes`
- `GET /api/usuarios`
- `GET /api/verificaciones`
- `GET /api/regiones`

## Estructura
- `frontend/`: SPA React modular
- `src/main/java/com/scanpesado/backend/`: API y logica de negocio
- `src/main/resources/static/`: frontend compilado y assets
- `pom.xml`: dependencias del backend
