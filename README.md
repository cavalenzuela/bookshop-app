# 📚 Bookshop

Aplicación full-stack de gestión de librería de última generación.

## 🛠️ Stack Tecnológico

- **Backend**: Java 21 + Spring Boot 3.4.x (Virtual Threads, Records)
- **Frontend**: Angular 20 (Signals, Zoneless, Control Flow)
- **Base de datos**: PostgreSQL 16
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

El script `database/init.sql` se ejecuta automáticamente al iniciar el contenedor de PostgreSQL.

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `bookshop`

⚠️ **Nota**: Cambiar credenciales en producción.

## 📚 Funcionalidades Implementadas

- [x] CRUD completo de Libros, Autores y Categorías.
- [x] Autenticación y Autorización basada en JWT.
- [x] Arquitectura moderna con Java Records y Angular Signals (Zoneless).
- [x] Manejo global de excepciones y validaciones de API.
- [x] Soporte para Virtual Threads (Project Loom) en el backend.

## 🤝 Contribución

Este es un proyecto de práctica personal. Sugerencias son bienvenidas.

## 📄 Licencia

MIT License - Proyecto educativo

## 🐛 Troubleshooting

### El contenedor de base de datos no inicia
```bash
docker-compose down -v
docker-compose up --build
```

### Puerto ya en uso
Cambiar puertos en `docker-compose.yml`

## 📸 Screenshots

![Home](docs/screenshots/home.png)

## 🎯 Roadmap

- [x] Setup inicial
- [x] Autenticación JWT integrada
- [x] Migración a **Java 21** (Records + Virtual Threads)
- [x] Migración a **Angular 20** (Signals + Zoneless mode)
- [x] Implementación de **Validaciones** y **Global Exception Handler**
- [ ] Paginación de resultados de la API
- [ ] Filtros avanzados de búsqueda
- [ ] Carrito de compras funcional