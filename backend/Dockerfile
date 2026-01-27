# Primera etapa: Construcción de la aplicación
# Usa Java 21 JDK para compilar la aplicación con Spring Boot 3.4.1
FROM eclipse-temurin:21-jdk AS build

# Instalar Maven desde repositorios de Debian
USER root
RUN apt-get update && apt-get install -y maven --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para la construcción
# Primero el pom.xml para aprovechar la caché de Maven
COPY pom.xml .
# Luego el código fuente
COPY src ./src

# Compila el proyecto y genera el archivo JAR
# -DskipTests omite la ejecución de pruebas para acelerar la construcción
RUN mvn clean package -DskipTests

# Segunda etapa: Imagen de ejecución
# Usar Java 21 JRE para ejecutar la aplicación (versión más ligera, solo runtime)
FROM eclipse-temurin:21-jre

# Instalar curl para el healthcheck
RUN apt-get update && apt-get install -y curl --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Configuración de usuario no-root
# Crear un usuario sin privilegios
# --system: Crea un usuario del sistema (sin shell de login)
# --no-create-home: No crea un directorio home para el usuario
# ya que no es necesario para la aplicación
# --group: Crea un grupo con el mismo nombre que el usuario
RUN adduser --system --no-create-home --group appuser

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Ajustar permisos del archivo JAR para el usuario no-root
RUN chown appuser:appuser app.jar

# Que el contenedor se ejecute con este usuario en lugar de root
USER appuser

# Expone el puerto que usa la aplicación
EXPOSE 8282

# Comando que se ejecutará al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]
