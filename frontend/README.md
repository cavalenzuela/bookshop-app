# APLICACIÓN DE LIBRERÍA ANGULAR
# Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 20.1.0.
# 
# La aplicación es un sistema de gestión de librería construido con Angular 20,
# con componentes para gestionar libros, autores y autenticación de usuarios.
# La aplicación utiliza arquitectura de componentes standalone al 100%.

## INICIO RÁPIDO - DESARROLLO

### Prerrequisitos
- **Node.js**: Versión 18 o superior
- **npm**: Generalmente viene con Node.js
- **Angular CLI**: Instalar globalmente con `npm install -g @angular/cli`
- **API Backend**: Ejecutándose en `http://127.0.0.1:8282`

### Instalación y Configuración
```bash
# Instalar dependencias del proyecto
npm install

# Iniciar el servidor de desarrollo
npm start
# o
ng serve
```

### Acceder a la Aplicación
- Abre tu navegador y navega a `http://localhost:4200/`
- La aplicación redirigirá automáticamente a la página de login
- Después del login exitoso, serás redirigido a la página principal
- La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente
- La recarga en caliente está habilitada para retroalimentación instantánea durante el desarrollo

## ARQUITECTURA DE LA APLICACIÓN
# Esta aplicación utiliza la arquitectura moderna de Angular 20, proporcionando:
# - **Signals**: Gestión de estado reactiva y eficiente.
# - **Zoneless**: Detección de cambios sin `zone.js` para mejor rendimiento.
# - **New Control Flow**: Uso de `@if`, `@for` y `@switch` para plantillas más limpias.
# - **Standalone Components**: 100% de componentes standalone (sin NgModules).
# - **Lazy Loading**: Carga perezosa con `loadComponent()`.
# - **Inyección de Dependencias**: Uso de `inject()` para una arquitectura moderna.

### Componentes Standalone
Todos los componentes están construidos como componentes standalone con plantillas y estilos inline:
- **Sin archivos HTML/CSS externos**: Todas las plantillas y estilos son inline
- **Autocontenidos**: Cada componente es completamente autónomo
- **Carga perezosa**: Los componentes se cargan bajo demanda
- **Arquitectura moderna**: Utiliza las últimas características de Angular 20

### Flujo de Autenticación
- **Ruta por defecto**: Redirige a `/login`
- **Rutas protegidas**: Todas las rutas de la aplicación requieren autenticación
- **Protección con guard**: Utiliza `authGuard` para protección de rutas
- **Basado en tokens**: Autenticación JWT con localStorage

## DESPLIEGUE CON DOCKER
# La aplicación incluye un archivo Dockerfile para facilitar el despliegue y uso en producción.
# Esta configuración proporciona un entorno listo para producción con rendimiento optimizado y seguridad.

### Prerrequisitos para Docker
- **Docker Desktop**: Debe estar instalado y ejecutándose en Windows

### Construcción de la imagen Docker
```bash
# Construir la imagen de producción
# Desde la raíz del proyecto

docker build -t bookshop-angular .
```

### Ejecución del contenedor Docker
```bash
# Ejecutar el contenedor de producción
# Mapea el puerto 8080 del host al 80 del contenedor

docker run -p 8080:80 bookshop-angular
```

### Archivos de Configuración Docker
- **Dockerfile**: Configuración de construcción multi-etapa
- **nginx.conf**: Configuración optimizada de Nginx para SPAs de Angular
- **.dockerignore**: Excluye archivos innecesarios del contexto de construcción

> **Nota:** Toda la orquestación y configuración relacionada a `docker-compose.yml` ahora se encuentra en el repositorio centralizado [`bookshop-config`].
> Consulta ese repositorio para levantar el sistema completo con múltiples servicios.

## FLUJO DE DESARROLLO

### Generación de Código
Angular CLI incluye potentes herramientas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
# Generar un nuevo componente standalone
ng generate component nombre-componente --standalone

# Generar un nuevo servicio
ng generate service nombre-servicio

# Generar un nuevo guard
ng generate guard nombre-guard
```

Para una lista completa de esquemas disponibles (como `components`, `directives`, `pipes`, `services`, `guards`), ejecuta:

```bash
ng generate --help
```

### Estructura del Proyecto
```
src/
├── app/
│   ├── components/          # Componentes UI standalone
│   │   ├── authors/        # Componentes de gestión de autores
│   │   │   ├── author-form/
│   │   │   │   └── author-form.component.ts (plantilla/estilos inline)
│   │   │   ├── author-list/
│   │   │   │   └── author-list.component.ts (plantilla/estilos inline)
│   │   │   └── authors.component.ts
│   │   ├── books/          # Componentes de gestión de libros
│   │   │   ├── book-form/
│   │   │   │   └── book-form.component.ts (plantilla/estilos inline)
│   │   │   ├── book-list/
│   │   │   │   └── book-list.component.ts (plantilla/estilos inline)
│   │   │   └── books.component.ts
│   │   ├── home/           # Componente de página principal
│   │   │   └── home.component.ts (plantilla/estilos inline)
│   │   ├── login/          # Componente de autenticación
│   │   │   └── login.component.ts (plantilla/estilos inline)
│   │   └── nav/            # Componente de navegación
│   │       └── nav.component.ts (plantilla/estilos inline)
│   ├── guards/             # Guards de protección de rutas
│   │   └── auth.guard.ts
│   ├── interceptors/       # Interceptores de peticiones HTTP
│   │   └── auth.interceptor.ts
│   ├── models/             # Interfaces y modelos TypeScript
│   │   ├── author.model.ts
│   │   └── book.model.ts
│   ├── services/           # Lógica de negocio y servicios API
│   │   ├── auth.service.ts
│   │   ├── author.service.ts
│   │   └── book.service.ts
│   ├── app.component.ts    # Componente raíz de la aplicación (standalone)
│   ├── app.config.ts       # Configuración de la aplicación
│   └── app.routes.ts       # Definiciones de rutas
├── assets/                 # Activos estáticos (imágenes, iconos, etc.)
└── styles.css              # Estilos globales
```

### Características Clave
- **Componentes Standalone**: Todos los componentes son standalone con plantillas inline
- **Carga Perezosa**: Los componentes se cargan bajo demanda usando `loadComponent()`
- **Protección de Rutas**: Guard de autenticación protege todas las rutas de la aplicación
- **Arquitectura Moderna**: Utiliza las últimas características de Angular 20
- **Sin NgModules**: Arquitectura completamente libre de módulos
- **Tests Unitarios Completos**: Cobertura de tests para todos los componentes, servicios, guards e interceptors
- **Testing Moderno**: Uso de Angular Testing Utilities, Jasmine y Karma con mejores prácticas

## CONSTRUCCIÓN PARA PRODUCCIÓN

### Construcción Local
Para construir el proyecto para producción, ejecuta:

```bash
# Construir con optimizaciones de producción
ng build

# Construir con configuración específica
ng build --configuration production
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/bookshop-angular/`. La construcción de producción incluye:
- **Minificación de Código**: Tamaños de archivo reducidos para carga más rápida
- **Tree Shaking**: Eliminación de código no utilizado
- **Optimización de Activos**: Imágenes comprimidas y bundles optimizados
- **Source Maps**: Deshabilitados para seguridad en producción

### Construcción de Producción con Docker
Para despliegue en producción usando Docker:

```bash
# Construir imagen de producción
docker build -t bookshop-angular .

# Ejecutar contenedor de producción
docker run -p 8080:80 bookshop-angular
```

## PRUEBAS

### Pruebas Unitarias
Para ejecutar pruebas unitarias con el test runner [Karma](https://karma-runner.github.io):

```bash
# Ejecutar todas las pruebas unitarias
ng test

# Ejecutar pruebas en modo watch
ng test --watch

# Ejecutar pruebas con cobertura
ng test --code-coverage

# Ejecutar pruebas en modo headless (sin interfaz gráfica)
ng test --watch=false --browsers=ChromeHeadless
```

### Cobertura de Tests
El proyecto incluye **tests unitarios completos** para todos los componentes, servicios, guards e interceptors:

#### Componentes con Tests
- ✅ **AppComponent** - Componente raíz de la aplicación
- ✅ **HomeComponent** - Página principal
- ✅ **LoginComponent** - Autenticación de usuarios
- ✅ **NavComponent** - Navegación principal (19/19 tests pasando)
- ✅ **BooksComponent** - Gestión de libros
- ✅ **AuthorsComponent** - Gestión de autores
- ✅ **CategoriesComponent** - Gestión de categorías
- ✅ **BookFormComponent** - Formulario de libros
- ✅ **BookListComponent** - Lista de libros
- ✅ **AuthorFormComponent** - Formulario de autores (23/23 tests pasando)
- ✅ **AuthorListComponent** - Lista de autores
- ✅ **CategoryFormComponent** - Formulario de categorías
- ✅ **CategoryListComponent** - Lista de categorías

#### Servicios con Tests
- ✅ **AuthService** - Servicio de autenticación
- ✅ **BookService** - Servicio de gestión de libros
- ✅ **AuthorService** - Servicio de gestión de autores
- ✅ **CategoryService** - Servicio de gestión de categorías

#### Guards e Interceptors con Tests
- ✅ **AuthGuard** - Guard de protección de rutas
- ✅ **AuthInterceptor** - Interceptor de autenticación HTTP

### Configuración de Tests
Los tests están configurados con:

- **Jasmine**: Framework de testing
- **Karma**: Test runner
- **Angular Testing Utilities**: TestBed, ComponentFixture, etc.
- **HttpClientTestingModule**: Para tests de servicios HTTP
- **RouterTestingModule**: Para tests de componentes con routing
- **Mocks y Spies**: Para simular dependencias

### Ejecutar Tests Específicos
```bash
# Ejecutar tests de un componente específico
ng test --include="**/nav.component.spec.ts"

# Ejecutar tests de un servicio específico
ng test --include="**/auth.service.spec.ts"

# Ejecutar tests de un directorio específico
ng test --include="**/components/**/*.spec.ts"
```

### Estructura de Tests
```
src/app/
├── components/
│   ├── authors/
│   │   ├── author-form/
│   │   │   └── author-form.component.spec.ts
│   │   ├── author-list/
│   │   │   └── author-list.component.spec.ts
│   │   └── authors.component.spec.ts
│   ├── books/
│   │   ├── book-form/
│   │   │   └── book-form.component.spec.ts
│   │   ├── book-list/
│   │   │   └── book-list.component.spec.ts
│   │   └── books.component.spec.ts
│   ├── categories/
│   │   ├── category-form/
│   │   │   └── category-form.component.spec.ts
│   │   ├── category-list/
│   │   │   └── category-list.component.spec.ts
│   │   └── categories.component.spec.ts
│   ├── home/
│   │   └── home.component.spec.ts
│   ├── login/
│   │   └── login.component.spec.ts
│   └── nav/
│       └── nav.component.spec.ts
├── guards/
│   └── auth.guard.spec.ts
├── interceptors/
│   └── auth.interceptor.spec.ts
├── services/
│   ├── auth.service.spec.ts
│   ├── author.service.spec.ts
│   ├── book.service.spec.ts
│   └── category.service.spec.ts
└── app.component.spec.ts
```

### Mejores Prácticas Implementadas
- **Mocking de Dependencias**: Uso de `jasmine.createSpyObj()` para servicios
- **Testing de Componentes Standalone**: Configuración correcta de TestBed
- **Testing de HTTP Services**: Uso de `HttpTestingController`
- **Testing de Guards**: Verificación de lógica de protección de rutas
- **Testing de Interceptors**: Verificación de modificación de requests HTTP
- **Testing de Formularios**: Validación de lógica de formularios
- **Testing de Navegación**: Verificación de redirecciones y routing

### Pruebas End-to-End
Para pruebas end-to-end (e2e):

```bash
# Ejecutar pruebas e2e
ng e2e

# Ejecutar pruebas e2e en modo headless
ng e2e --headless
```

**Nota**: Angular CLI no viene con un framework de pruebas end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades (Cypress, Playwright, etc.).

### Pruebas en Docker
```bash
# Ejecutar pruebas en contenedor Docker
docker run --rm bookshop-angular npm test

# Ejecutar pruebas e2e en Docker
docker run --rm bookshop-angular npm run e2e
```

### CI/CD Integration
Los tests están configurados para ejecutarse en pipelines de CI/CD:

```yaml
# Ejemplo de workflow de GitHub Actions
- name: Run Tests
  run: |
    npm install
    ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

## CONFIGURACIÓN Y ENTORNO

### Variables de Entorno
La aplicación soporta diferentes entornos:

```bash
# Entorno de desarrollo (por defecto)
ng serve

# Entorno de producción
ng serve --configuration production

# Entorno personalizado
ng serve --configuration staging
```

### Archivos de Configuración
- **angular.json**: Configuración de Angular CLI y configuraciones de construcción
- **tsconfig.json**: Configuración del compilador TypeScript
- **tailwind.config.js**: Configuración de Tailwind CSS
- **postcss.config.js**: Configuración de procesamiento PostCSS

### Configuraciones de Construcción
El proyecto incluye múltiples configuraciones de construcción:
- **development**: Optimizado para desarrollo con source maps
- **production**: Optimizado para producción con minificación

## OPCIONES DE DESPLIEGUE

### Desarrollo Local
- **Servidor Dev de Angular**: `ng serve` para desarrollo con recarga en caliente

### Despliegue en Producción
- **Docker**: Despliegue containerizado con Nginx
- **Hosting Estático**: Desplegar archivos construidos a CDN o hosting estático
- **Plataformas Cloud**: Desplegar a AWS, Azure, Google Cloud, etc.

### Integración CI/CD
La configuración Docker está lista para pipelines CI/CD:
```yaml
# Ejemplo de workflow de GitHub Actions
- name: Build and Deploy
  run: |
    docker build -t bookshop-angular .
    docker push tu-registro/bookshop-angular
```

## SOLUCIÓN DE PROBLEMAS

### Problemas Comunes

#### Puerto Ya en Uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :4200

# Matar el proceso o usar un puerto diferente
ng serve --port 4201
```

#### Problemas de Construcción Docker
```bash
# Limpiar caché de Docker
docker system prune -a

# Reconstruir sin caché
docker build --no-cache -t bookshop-angular .
```

#### Problemas de Dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Problemas de Conexión Backend
```bash
# Asegurar que el backend esté ejecutándose en http://127.0.0.1:8282
# Verificar si la API backend es accesible
curl http://127.0.0.1:8282/health
```

### Obtener Ayuda
- **Documentación de Angular**: [angular.dev](https://angular.dev)
- **Documentación de Docker**: [docs.docker.com](https://docs.docker.com)
- **Documentación de Nginx**: [nginx.org](https://nginx.org/en/docs/)

## RECURSOS ADICIONALES

### Angular CLI
Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

### Dependencias del Proyecto
- **Angular**: 20.1.0 - Framework frontend con componentes standalone
- **RxJS**: 7.8.2 - Biblioteca de programación reactiva
- **Tailwind CSS**: 3.4.1 - Framework CSS utility-first
- **TypeScript**: 5.8.3 - JavaScript con tipos

### Herramientas de Desarrollo
- **Angular CLI**: Interfaz de línea de comandos para Angular
- **Karma**: Test runner de JavaScript
- **Jasmine**: Framework de testing para JavaScript
- **Angular Testing Utilities**: TestBed, ComponentFixture, HttpTestingController
- **PostCSS**: Herramienta de procesamiento CSS
- **Autoprefixer**: Prefijos de vendedor CSS

### Monitoreo de Rendimiento
- **Lighthouse**: Auditar rendimiento de la aplicación
- **WebPageTest**: Análisis detallado de rendimiento
- **Chrome DevTools**: Herramientas de rendimiento integradas del navegador

### Beneficios de la Arquitectura
- **Componentes Standalone**: Sin NgModules, mejor tree-shaking
- **Carga Perezosa**: Tiempos de carga inicial más rápidos
- **Plantillas Inline**: Mejor rendimiento, sin dependencias de archivos externos
- **Angular Moderno**: Últimas características y optimizaciones
- **Testing Robusto**: Tests unitarios completos con cobertura de todos los componentes y servicios
- **Calidad de Código**: Implementación de mejores prácticas de testing con mocks y spies
- **CI/CD Ready**: Configuración lista para pipelines de integración continua
