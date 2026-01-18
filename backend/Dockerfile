# Primera etapa: Construcción de la aplicación
# Usa una imagen de Maven con Java 17 para compilar la aplicación
FROM maven:3.9.6-eclipse-temurin-17 AS build

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
# Usa una imagen ligera con solo el JRE de Java 17
FROM eclipse-temurin:17-jre

# Configuración de usuario no-root
# Crear un usuario sin privilegios
# --system: Crea un usuario del sistema (sin shell de login)
# --no-create-home: No crea un directorio home para el usuario
# ya que no es necesario para la aplicación
# --group: Crea un grupo con el mismo nombre que el usuario
RUN adduser --system --no-create-home --group appuser

# Que el contenedor se ejecute con este usuario en lugar de root
USER appuser

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto que usa la aplicación
EXPOSE 8282

# Comando que se ejecutará al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]
