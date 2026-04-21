# 📚 Bookshop

Aplicación full-stack de gestión de librería.

## 🛠️ Stack Tecnológico

- **Backend**: Java 21 + Spring Boot 3.4.x (Virtual Threads, Records)
- **Frontend**: Angular 20 (Signals, Zoneless, Control Flow)
- **Caché**: Redis 7
- **Base de datos**: PostgreSQL 16
- **CI/CD**: GitHub Actions + SonarCloud
- **Containerización**: Docker + Docker Compose

## 📁 Estructura del Proyecto
```
bookshop/
├── backend/          # API REST con Spring Boot
├── frontend/         # SPA con Angular
├── database/         # Scripts SQL de inicialización
└── docker-compose.yml
```

## 🚀 Inicio Rápido

### Prerequisitos

- Docker
- Docker Compose

### Ejecutar la aplicación
```bash
# Clonar el repositorio
git clone https://github.com/cavalenzuela/bookshop-app.git
cd bookshop-app

# Iniciar todos los servicios
docker-compose up --build
```

### Acceder a la aplicación

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8282
- **Swagger UI**: http://localhost:8282/swagger-ui.html
- **Redis Insight**: http://localhost:8001
- **Base de datos**: localhost:5432

## 🔧 Comandos Útiles
```bash
# Iniciar servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reconstruir un servicio específico
docker-compose up --build backend

# Detener servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v
```

## 📝 Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🗄️ Base de Datos

El script `database/init.sql` genera las tablas en PostgreSQL.

## 📚 Funcionalidades Implementadas

- [x] CRUD completo de Libros, Autores y Categorías.
- [x] Autenticación y Autorización basada en JWT.
- [x] Arquitectura moderna con Java Records y Angular Signals (Zoneless).
- [x] Manejo global de excepciones y validaciones de API.
- [x] Soporte para Virtual Threads (Project Loom) en el backend.
- [x] Caché de datos con Redis para mejorar el rendimiento.
- [x] Documentación interactiva con Swagger/OpenAPI.
- [x] Integración Continua (CI) con GitHub Actions.
- [x] Análisis de calidad de código con SonarCloud.

## 🚀 Configuración de CI/CD (GitHub Actions + SonarCloud)

Para que el análisis de SonarCloud funcione en tu repositorio, sigue estos pasos manuales:

### 1. Preparación en SonarCloud
1. Ve a [SonarCloud.io](https://sonarcloud.io/) e inicia sesión con tu cuenta de GitHub.
2. Crea una nueva Organización (generalmente con tu nombre de usuario de GitHub).
3. Crea dos proyectos nuevos:
   - Uno para el backend: `bookshop-app-backend`
   - Uno para el frontend: `bookshop-app-frontend`
4. Ve a tu perfil en SonarCloud -> **My Account** -> **Security** y genera un nuevo token llamado `GITHUB_ACTIONS_TOKEN`. Copia este token.

### 2. Configuración en GitHub
1. Entra a tu repositorio en GitHub.
2. Ve a **Settings** -> **Secrets and variables** -> **Actions**.
3. Haz clic en **New repository secret**.
4. Nombre: `SONAR_TOKEN`.
5. Valor: Pega el token que copiaste de SonarCloud.

### 3. Ejecución
Cada vez que hagas un `git push` a la rama `main` o abras un Pull Request, se activará automáticamente el archivo `.github/workflows/ci.yml`. Podrás ver el progreso en la pestaña **Actions** de tu repositorio.