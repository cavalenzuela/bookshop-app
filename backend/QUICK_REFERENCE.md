# 🚀 GUÍA RÁPIDA DE REFERENCIA - Análisis Bookshop

**Uso:** Consulta esta guía para referencias rápidas durante la implementación.

---

## 📋 Tabla de Contenidos Rápida

| Documento | Propósito | Tiempo |
|-----------|-----------|--------|
| **RESUMEN_EJECUTIVO.md** | Visión general, decisiones exec | 5 min |
| **ANALISIS_TECNICO.md** | Análisis detallado + soluciones | 20 min |
| **GUIA_IMPLEMENTACION.md** | Código listo para implementar | 30 min |
| **MATRIZ_EVALUACION.md** | Gráficos, KPIs, timeline | 10 min |
| **ARQUITECTURA_MEJORADA.md** | Diagramas, flujos, stack | 15 min |

---

## 🎯 Quick Reference - Problemas & Soluciones

### Problema 1: Errores genéricos sin contexto
**Síntoma:** Cuando algo falla, obtienes `RuntimeException`  
**Solución:** Crear excepciones personalizadas  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 1  
**Tiempo:** 4 horas  

---

### Problema 2: Cambios de BD sin control transaccional
**Síntoma:** Datos inconsistentes, rollback no funciona  
**Solución:** Agregar `@Transactional` en servicios  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 2  
**Tiempo:** 3 horas  

---

### Problema 3: No puedo debuggear en producción
**Síntoma:** Aplicación falla pero no hay logs útiles  
**Solución:** Logging estructurado con SLF4J  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 2 & 4  
**Tiempo:** 8 horas  

---

### Problema 4: API vulnerable a DoS
**Síntoma:** Alguien puede hacer 1000 requests/segundo  
**Solución:** Rate limiting con Bucket4j  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 7  
**Tiempo:** 6 horas  

---

### Problema 5: No tengo auditoría legal
**Síntoma:** No puedo responder "¿quién modificó qué?"  
**Solución:** JPA Auditing con created_by, updated_by  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 3  
**Tiempo:** 6 horas  

---

### Problema 6: Queries N+1 lentas
**Síntoma:** Cada request tarda 200ms  
**Solución:** Spring Cache + Caché layer  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 6  
**Tiempo:** 4 horas  

---

### Problema 7: Todos pueden borrar cualquier recurso
**Síntoma:** Usuario normal borra libros  
**Solución:** RBAC con @PreAuthorize  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 8  
**Tiempo:** 8 horas  

---

### Problema 8: Tests incompletos
**Síntoma:** Tests solo en controladores, sin integración  
**Solución:** Tests de integración con @SpringBootTest  
**Archivo:** `GUIA_IMPLEMENTACION.md` → Sección 5  
**Tiempo:** 16 horas  

---

## 🔍 Cómo Implementar (Paso a Paso Rápido)

### ✅ MÁS RÁPIDO (3-4 horas)

```
1. Excepciones personalizadas
   └─ Copiar ResourceNotFoundException.java
   └─ Copiar InvalidOperationException.java
   └─ Actualizar GlobalExceptionHandler.java
   
2. @Transactional
   └─ Agregar @Transactional a BookServiceImpl
   └─ Agregar @Transactional(readOnly=true) a métodos GET
   └─ Prueba: mvn test
```

**Comando:**
```bash
cd D:\GitHub\bookshop-app\backend
# Copiar código de GUIA_IMPLEMENTACION.md secciones 1-2
mvn clean test
```

---

### 🟡 MEDIO (4-8 horas)

```
3. Logging
   └─ Crear logback-spring.xml
   └─ Agregar @Slf4j a servicios
   └─ Reemplazar System.out por log.info/debug
   
4. Auditoría
   └─ Crear BaseEntity.java
   └─ Actualizar entidades
   └─ Habilitar @EnableJpaAuditing
```

**Comando:**
```bash
# Copiar código de GUIA_IMPLEMENTACION.md secciones 3-4
mvn clean compile
# Validar que no hay errores
```

---

### 🔴 COMPLETO (16+ horas)

```
5. Tests Integración
   └─ Crear BookServiceIntegrationTest.java
   └─ Crear application-test.yml
   └─ Agregar H2 dependency
   
6. Caché
   └─ Crear CacheConfig.java
   └─ Agregar @Cacheable/@CacheEvict
   
7. Rate Limiting
   └─ Agregar bucket4j dependency
   └─ Crear RateLimitingFilter.java
   
8. RBAC
   └─ Agregar @EnableMethodSecurity
   └─ Agregar @PreAuthorize anotaciones
```

**Comando:**
```bash
# Copiar código de GUIA_IMPLEMENTACION.md secciones 5-8
mvn clean package
# Ejecutar tests
mvn test
```

---

## 📊 Checklist de Implementación Rápida

### SEMANA 1: Seguridad de Datos
```
DAY 1:
[ ] Crear excepciones personalizadas (2h)
[ ] Actualizar GlobalExceptionHandler (1h)

DAY 2-3:
[ ] Agregar @Transactional (1h)
[ ] Validaciones de negocio (3h)

DAY 4-5:
[ ] Testing & debugging (2h)
[ ] Code review (1h)
```

### SEMANA 2: Observabilidad
```
DAY 1-2:
[ ] Logging estructurado (4h)
[ ] Auditoría JPA (3h)

DAY 3-4:
[ ] Tests & debugging (3h)
[ ] Documentación (1h)

DAY 5:
[ ] Code review & merge (1h)
```

---

## 🔑 Comandos Esenciales

```bash
# Compilar sin tests
mvn clean compile

# Ejecutar tests
mvn clean test

# Tests específicos
mvn test -Dtest=BookServiceIntegrationTest

# Build completo
mvn clean package -DskipTests

# Ver dependencias
mvn dependency:tree

# Buscar vulnerabilidades
mvn org.owasp:dependency-check-maven:check

# Limpiar caché de Maven
mvn clean

# Ejecutar aplicación
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Generar Javadoc
mvn javadoc:javadoc

# Code coverage (si tienes Jacoco)
mvn clean test jacoco:report
```

---

## 📝 Files a Modificar vs. Crear

### CREAR (Nuevos archivos)
```
✨ src/main/java/com/bookshop/exception/
   ├─ ResourceNotFoundException.java (NEW)
   ├─ InvalidOperationException.java (NEW)
   
✨ src/main/java/com/bookshop/config/
   ├─ CacheConfig.java (NEW)
   ├─ RateLimitingFilter.java (NEW)
   
✨ src/main/java/com/bookshop/domain/entities/
   ├─ BaseEntity.java (NEW)
   
✨ src/main/resources/
   ├─ logback-spring.xml (NEW)
   
✨ src/test/java/com/bookshop/services/
   ├─ BookServiceIntegrationTest.java (NEW)
   
✨ src/test/resources/
   ├─ application-test.yml (NEW)
```

### MODIFICAR (Archivos existentes)
```
📝 src/main/java/com/bookshop/
   ├─ BookShopApplication.java (@EnableJpaAuditing)
   ├─ controller/GlobalExceptionHandler.java (Mejorar)
   ├─ controller/BookController.java (@PreAuthorize + @Slf4j)
   ├─ domain/entities/BookEntity.java (Heredar BaseEntity)
   ├─ domain/entities/AuthorEntity.java (Heredar BaseEntity)
   ├─ config/SecurityConfig.java (@EnableMethodSecurity)
   ├─ services/impl/BookServiceImpl.java (@Transactional + @Slf4j + @Cacheable)
   
📝 pom.xml (Agregar dependencias)
   ├─ bucket4j
   ├─ h2-database (test)
   
📝 src/main/resources/
   ├─ application.yml (logging config)
   ├─ application-dev.yml (logging config)
```

---

## 🧪 Validación Post-Implementación

### Para cada mejora, ejecutar:

```bash
# 1. Compilar sin errores
mvn clean compile

# 2. Tests pasan
mvn clean test

# 3. Build exitoso
mvn clean package -DskipTests

# 4. Verificar en IDE (sin errores rojo)
# En JetBrains: Ctrl+Shift+Alt+L (Lint)

# 5. Ejecutar aplicación
mvn spring-boot:run

# 6. Verificar Swagger
# Abrir: http://localhost:8282/swagger-ui.html
```

---

## 💡 Tips Productividad

### Al implementar Excepciones:
```
1. Copiar ResourceNotFoundException.java
2. Copiar InvalidOperationException.java
3. Copiar new GlobalExceptionHandler.java (replace)
4. En IDE: Search "RuntimeException" → Replace con ResourceNotFoundException
5. Run tests: mvn test
```

### Al implementar @Transactional:
```
1. Agregar a clase: @Service @Transactional @Slf4j
2. En métodos GET: @Transactional(readOnly=true)
3. Run tests: mvn test
4. Verificar: No hay "auto-commit" en logs
```

### Al implementar Logging:
```
1. Crear logback-spring.xml
2. Agregar @Slf4j a cada servicio
3. Reemplazar: System.out → log.info/debug
4. En producción: logs van a archivos
5. En desarrollo: logs en consola
```

---

## 🚨 Errores Comunes & Cómo Evitarlos

### Error 1: `@Transactional pero sin Spring Context`
**Causa:** @Transactional solo funciona en beans gestionados  
**Solución:** Asegurar `@Service` en la clase  
```java
@Service  // ← IMPORTANTE
@Transactional
public class BookServiceImpl {
```

---

### Error 2: `Circular dependency en logging`
**Causa:** Logging en constructor  
**Solución:** Usar @Slf4j en clase, no inyectar  
```java
@Service
@Slf4j  // ← Mejor que @Autowired Logger
public class BookServiceImpl {
    public BookServiceImpl() {
        log.info("Inicializando"); // ✓ Funciona
    }
}
```

---

### Error 3: `@Cacheable no invalida en UPDATE`
**Causa:** Olvidar @CacheEvict en PUT/DELETE  
**Solución:** Siempre ir con pair  
```java
@Cacheable("books", key="#isbn")
public Optional<BookEntity> findOne(String isbn) {
    
@CacheEvict("books", key="#isbn")  // ← Siempre juntos
public BookEntity createUpdateBook(String isbn, BookEntity book) {
```

---

### Error 4: `Rate Limiting bloquea Swagger`
**Causa:** Olvidar shouldNotFilter()  
**Solución:** Excluir rutas públicas  
```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/swagger-ui") || 
           path.startsWith("/api-docs");
}
```

---

### Error 5: `@PreAuthorize error 403 todo el tiempo`
**Causa:** Roles no en formato "ROLE_"  
**Solución:** Validar prefijo en CustomUserDetailsService  
```java
.map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
//                                       ^^^^^^^^ CRÍTICO
```

---

## 📞 Recursos & Referencias

### Documentación Oficial
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Cache](https://spring.io/guides/gs/caching/)

### Librerías Usadas
- [Bucket4j Docs](https://github.com/vladimir-bukhtoyarov/bucket4j)
- [Lombok Features](https://projectlombok.org/features/all)
- [JUnit 5](https://junit.org/junit5/)
- [Mockito](https://github.com/mockito/mockito)

### Guías Útiles
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [12 Factor App](https://12factor.net/)
- [Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-136091.html)

---

## ⏱️ Estimación de Tiempo Total

| Mejora | Tiempo | Dificultad | Valor |
|--------|--------|-----------|-------|
| Excepciones | 4h | 🟢 Fácil | 🟠 Alto |
| @Transactional | 3h | 🟢 Fácil | 🔴 Crítico |
| Logging | 8h | 🟡 Medio | 🟠 Alto |
| Auditoría | 6h | 🟡 Medio | 🟠 Alto |
| Tests Integración | 16h | 🔴 Difícil | 🟠 Alto |
| Rate Limiting | 6h | 🟡 Medio | 🟡 Medio |
| Caching | 4h | 🟢 Fácil | 🟡 Medio |
| RBAC | 8h | 🟡 Medio | 🟠 Alto |
| **TOTAL** | **55h** | **Mixto** | **Crítico** |

---

## ✅ Final Checklist

Antes de ir a producción:

```
ARQUITECTURA:
[ ] Excepciones personalizadas implementadas
[ ] @Transactional en servicios
[ ] Validaciones de negocio completas

OBSERVABILIDAD:
[ ] Logging estructurado funcionando
[ ] Auditoría JPA en BD
[ ] Health checks respondiendo

SEGURIDAD:
[ ] RBAC implementado (@PreAuthorize)
[ ] Rate limiting activo
[ ] JWT validando issuer/audience

TESTING:
[ ] Tests unitarios pasan
[ ] Tests integración pasan
[ ] Coverage > 70%

DEPLOYMENT:
[ ] Docker build exitoso
[ ] Health checks en contenedor
[ ] Variables de entorno configuradas

DOCUMENTACIÓN:
[ ] README actualizado
[ ] Swagger UI funciona
[ ] JavaDoc completo
```

---

**¡Listo para empezar!** 🚀

Comienza con la Sección 1 de GUIA_IMPLEMENTACION.md
