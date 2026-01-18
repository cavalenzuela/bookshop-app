# =============================================================================
# DOCKERFILE MULTI-ETAPA PARA APLICACIÓN ANGULAR
# =============================================================================
# Este Dockerfile utiliza un enfoque de construcción multi-etapa para crear una imagen
# de producción optimizada para la aplicación Angular.
# 
# Etapa 1: Etapa de construcción - Compila la aplicación Angular
# Etapa 2: Etapa de producción - Sirve la aplicación construida con nginx
# =============================================================================

# =============================================================================
# ETAPA 1: ETAPA DE CONSTRUCCIÓN
# =============================================================================
# Esta etapa instala dependencias y construye la aplicación Angular
# Usamos Node.js 20 Alpine para una imagen base más pequeña y segura
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
# Todos los comandos siguientes se ejecutarán desde este directorio
WORKDIR /app

# Copia primero package.json y package-lock.json
# Esto permite a Docker almacenar en caché el paso de npm install si solo cambia el código fuente
# npm ci se usa en lugar de npm install para construcciones más confiables en CI/CD
COPY package*.json ./

# Instala todas las dependencias (incluyendo las de desarrollo necesarias para construir)
# No se usa la bandera --only=production aquí porque necesitamos dependencias de desarrollo para construir
RUN npm ci

# Copia todo el código fuente al contenedor
# Esto incluye todos los componentes, servicios y archivos de configuración de Angular
COPY . .

# Construye la aplicación Angular para producción
# Esto crea archivos optimizados y minificados en el directorio dist/bookshop-angular
# El proceso de construcción incluye tree-shaking, code splitting y optimización de recursos
RUN npm run build

# =============================================================================
# ETAPA 2: ETAPA DE PRODUCCIÓN
# =============================================================================
# Esta etapa crea la imagen final de producción usando nginx para servir la aplicación construida
# Usamos nginx:alpine por ser un servidor web ligero y seguro
FROM nginx:alpine

# Crear un usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia la aplicación construida desde la etapa de construcción
# Los archivos construidos se copian al directorio raíz web por defecto de nginx
# Esto incluye todos los archivos HTML, CSS, JS y recursos necesarios para ejecutar la aplicación
COPY --from=build /app/dist/bookshop-angular/browser /usr/share/nginx/html

# Establecer los permisos correctos
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Cambiar al usuario no-root
USER appuser

# Copia nuestra configuración personalizada de nginx
# Esta configuración está optimizada para SPAs de Angular con soporte adecuado de rutas
# Incluye cabeceras de seguridad, compresión y configuraciones de caché
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80 para tráfico HTTP
# Esto le indica a Docker que el contenedor escuchará en el puerto 80
# El mapeo real de puertos se configura en docker-compose.yml
EXPOSE 80

# Inicia nginx en primer plano
# La bandera -g "daemon off;" evita que nginx se ejecute en segundo plano
# Esto es necesario para que los contenedores Docker permanezcan en ejecución
CMD ["nginx", "-g", "daemon off;"] 