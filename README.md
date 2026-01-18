# 📚 Bookshop

Aplicación full-stack de gestión de librería para práctica de desarrollo.

## 🛠️ Stack Tecnológico

- **Backend**: Java 17 + Spring Boot 3.x
- **Frontend**: Angular 17+
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
git clone https://github.com/tu-usuario/bookshop.git
cd bookshop

# Iniciar todos los servicios
docker-compose up --build
```

### Acceder a la aplicación

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
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
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## 🗄️ Base de Datos

El script `database/init.sql` se ejecuta automáticamente al iniciar el contenedor de PostgreSQL.

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `bookshop`

⚠️ **Nota**: Cambiar credenciales en producción.

## 📚 Funcionalidades

- [ ] CRUD de libros
- [ ] Gestión de categorías
- [ ] Sistema de búsqueda
- [ ] Carrito de compras

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
- [ ] Autenticación JWT
- [ ] Paginación
- [ ] Filtros avanzados