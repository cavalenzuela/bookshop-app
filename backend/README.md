# Bookshop - Aplicación Spring Boot

## Descripción del Proyecto

Bookshop es una aplicación web desarrollada con Spring Boot que implementa un sistema de gestión de una librería. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre un catálogo de libros, con funcionalidades de autenticación y autorización.

## Características Principales

- **Autenticación de Usuarios**: Sistema de registro e inicio de sesión seguro con JWT.
- **Gestión de Libros**: CRUD completo para el catálogo de libros.
- **API RESTful**: Interfaz de programación para integración con otros sistemas.
- **Documentación Interactiva**: Swagger UI integrado para documentación y pruebas de la API.
- **Base de Datos PostgreSQL**: Almacenamiento persistente de la información.
- **Dockerizado**: Fácil despliegue en cualquier entorno con Docker.
- **Configuración Segura**: Uso de variables de entorno y perfiles de Spring para mayor seguridad.

## Requisitos Previos

- Docker Desktop instalado en tu sistema
- Git (para clonar los repositorios)
- Mínimo 4GB de RAM asignados a Docker
- Java 17 o superior (para desarrollo local)
- Maven 3.6+ (para desarrollo local)
- PostgreSQL (para desarrollo local)

## Estructura del Proyecto

```
bookshop/
├── src/                    # Código fuente de la aplicación
│   └── main/
│       ├── java/com/bookshop/
│       │   ├── config/              # Configuraciones (Security, OpenAPI, etc.)
│       │   ├── controller/          # Controladores REST
│       │   ├── domain/              # Entidades y DTOs
│       │   ├── repositories/        # Repositorios JPA
│       │   ├── services/            # Lógica de negocio
│       │   └── security/            # Configuración de seguridad JWT
│       └── resources/
│           ├── application.yml        # Configuración principal
│           └── application-dev.yml    # Configuración de desarrollo
├── target/                # Archivos compilados (generado automáticamente)
├── .dockerignore         # Archivos ignorados por Docker
├── Dockerfile            # Configuración para construir la imagen Docker
├── pom.xml              # Configuración de Maven y dependencias
└── README.md            # Este archivo
```

## Repositorios Relacionados

La configuración Docker completa para este proyecto se encuentra en un repositorio separado:
- **Repositorio de Configuración Docker**: [bookshop-config](https://github.com/cavalenzuela/bookshop-config)

## Configuración del Proyecto

### Archivos de Configuración

El proyecto utiliza archivos YAML para la configuración, siguiendo las mejores prácticas de seguridad:

1. **application.yml**: 
   - Contiene la configuración base del proyecto
   - No incluye información sensible
   - Define configuraciones generales de la aplicación

2. **application-dev.yml**:
   - Contiene configuración específica para desarrollo
   - Configuración de base de datos local
   - Configuración específica de Swagger para desarrollo
   - Configuración de JWT y otros parámetros sensibles

## Documentación de la API con Swagger

La aplicación incluye documentación interactiva de la API utilizando **SpringDoc OpenAPI** (Swagger UI). Esta funcionalidad permite:

### Características de Swagger
- **Documentación automática** de todos los endpoints REST
- **Interfaz interactiva** para probar los endpoints directamente desde el navegador
- **Autenticación JWT** integrada en Swagger UI
- **Organización por tags** (libros, autores, categorías, autenticación)
- **Información detallada** de modelos de datos (DTOs)
- **Configuración específica** para entorno de desarrollo

### Configuración de Swagger
- **Dependencia**: SpringDoc OpenAPI 2.2.0
- **Configuración**: `OpenApiConfig.java` con metadatos de la API
- **Seguridad**: Endpoints de Swagger configurados para acceso sin autenticación
- **CORS**: Configurado para permitir acceso desde localhost:8282

### Endpoints de Swagger
- **Swagger UI**: `http://localhost:8282/swagger-ui.html`
- **API Docs JSON**: `http://localhost:8282/api-docs`

## Desarrollo Local

### Prerrequisitos para Desarrollo
- Java 17 o superior
- Maven 3.6+
- PostgreSQL ejecutándose en localhost:5434
- Base de datos `bookshop` creada

### Ejecutar la Aplicación Localmente

1. **Clonar el repositorio**:
```bash
git clone https://github.com/cavalenzuela/bookshop.git
cd bookshop
```

2. **Compilar el proyecto**:
```bash
mvn clean compile
```

3. **Ejecutar la aplicación**:
```bash
mvn spring-boot:run
```

4. **Acceder a la aplicación**:
- **API REST**: http://localhost:8282
- **Swagger UI**: http://localhost:8282/swagger-ui.html
- **API Docs**: http://localhost:8282/api-docs

### Usar Swagger UI

1. Abre http://localhost:8282/swagger-ui.html en tu navegador
2. Explora los endpoints disponibles organizados por tags
3. Para probar endpoints protegidos:
   - Primero usa `/auth/register` o `/auth/login` para obtener un token JWT
   - Haz clic en el botón "Authorize" en Swagger UI
   - Ingresa: `Bearer <tu-token-jwt>`
   - Ahora puedes probar todos los endpoints protegidos

## Construcción y Despliegue con Docker

### 1. Construcción de la Imagen Docker

Para construir la imagen Docker del proyecto, ejecuta desde la raíz del proyecto:

```bash
docker build -t bookshop-springboot -f Dockerfile .
```

### 2. Configuración del Entorno

Asegúrate de tener configuradas todas las variables de entorno necesarias en tu sistema.

### 3. Clonar los repositorios

```bash
# Clonar el repositorio principal
git clone https://github.com/cavalenzuela/bookshop.git

# Clonar el repositorio de configuración Docker (contiene docker-compose.yml)
git clone https://github.com/cavalenzuela/bookshop-config.git
```

### 4. Acceder a la aplicación

Una vez que la aplicación esté en ejecución, podrás acceder a:

- **Aplicación:** http://localhost:8282
- **Swagger UI:** http://localhost:8282/swagger-ui.html

## Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.0** - Framework principal
- **Java 17** - Lenguaje de programación
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL** - Base de datos relacional
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **ModelMapper** - Mapeo entre entidades y DTOs

### Documentación y Testing
- **SpringDoc OpenAPI 2.2.0** - Documentación interactiva de la API
- **Swagger UI** - Interfaz web para probar endpoints
- **Spring Boot Test** - Framework de testing

### Herramientas de Desarrollo
- **Maven** - Gestión de dependencias y construcción
- **Docker** - Containerización
- **Lombok** - Reducción de código boilerplate