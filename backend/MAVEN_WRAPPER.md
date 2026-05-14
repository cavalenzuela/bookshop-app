# Maven Wrapper

Este proyecto usa Maven Wrapper para garantizar que todos los desarrolladores usen la misma versión de Maven sin necesidad de instalarlo localmente o usar el bundle de IntelliJ.

## ¿Qué es Maven Wrapper?

Maven Wrapper es una herramienta que descarga automáticamente la versión de Maven especificada en el proyecto y la ejecuta desde el directorio `.mvn/wrapper/`. Esto garantiza consistencia en el entorno de desarrollo.

## Uso

### En Linux/Mac:
```bash
./mvnw clean install
./mvnw test
./mvnw spring-boot:run
```

### En Windows:
```cmd
mvnw.cmd clean install
mvnw.cmd test
mvnw.cmd spring-boot:run
```

O simplemente usar `mvnw` en PowerShell/CMD (debería funcionar automáticamente).

## Configuración

La configuración de Maven Wrapper se encuentra en:
- `.mvn/wrapper/maven-wrapper.properties` - Define la versión de Maven a descargar
- `.mvn/wrapper/maven-wrapper.jar` - El JAR del wrapper (no debe editarse)

### Versión de Maven actual:
**3.9.6**

## Ventajas

✅ No requiere Maven instalado localmente
✅ No usa el bundle de IntelliJ
✅ Todos los desarrolladores usan la misma versión de Maven
✅ El wrapper se descarga automáticamente en la primera ejecución
✅ Se puede compartir fácilmente en repositorios

## Cambiar la versión de Maven

Si necesitas cambiar la versión de Maven, edita el archivo `.mvn/wrapper/maven-wrapper.properties` y actualiza la URL en `distributionUrl`.

Ejemplo para Maven 3.9.7:
```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.7/apache-maven-3.9.7-bin.zip
```

La próxima vez que ejecutes `./mvnw` descargará la nueva versión automáticamente.
