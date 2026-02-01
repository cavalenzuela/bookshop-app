# Guía de Implementación de Mejoras - Bookshop Backend

Este documento contiene ejemplos de código listos para implementar las mejoras identificadas en el análisis técnico.

---

## 1. EXCEPCIONES PERSONALIZADAS

### Crear excepciones personalizadas

**Archivo:** `src/main/java/com/bookshop/exception/ResourceNotFoundException.java`
```java
package com.bookshop.exception;

/**
 * Excepción lanzada cuando un recurso solicitado no existe.
 * Corresponde a respuesta HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }
    
    public String getResourceName() {
        return resourceName;
    }
    
    public String getFieldName() {
        return fieldName;
    }
    
    public Object getFieldValue() {
        return fieldValue;
    }
}
```

**Archivo:** `src/main/java/com/bookshop/exception/InvalidOperationException.java`
```java
package com.bookshop.exception;

/**
 * Excepción lanzada cuando se intenta realizar una operación inválida.
 * Corresponde a respuesta HTTP 400 Bad Request.
 */
public class InvalidOperationException extends RuntimeException {
    
    public InvalidOperationException(String message) {
        super(message);
    }
    
    public InvalidOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### Actualizar GlobalExceptionHandler

**Archivo:** `src/main/java/com/bookshop/controller/GlobalExceptionHandler.java`
```java
package com.bookshop.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.bookshop.exception.InvalidOperationException;
import com.bookshop.exception.ResourceNotFoundException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Modelo de respuesta de error
    private static class ErrorResponse {
        public String errorCode;
        public String message;
        public LocalDateTime timestamp;
        public String path;

        ErrorResponse(String errorCode, String message, LocalDateTime timestamp, String path) {
            this.errorCode = errorCode;
            this.message = message;
            this.timestamp = timestamp;
            this.path = path;
        }
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            "RESOURCE_NOT_FOUND",
            ex.getMessage(),
            LocalDateTime.now(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOperation(
            InvalidOperationException ex, WebRequest request) {
        log.warn("Invalid operation: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            "INVALID_OPERATION",
            ex.getMessage(),
            LocalDateTime.now(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        log.warn("Validation error occurred");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(
            Exception ex, WebRequest request) {
        log.error("Unexpected error occurred", ex);
        
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred",
            LocalDateTime.now(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

---

## 2. TRANSACCIONES EXPLÍCITAS Y LOGGING

**Archivo:** `src/main/java/com/bookshop/services/impl/BookServiceImpl.java`
```java
package com.bookshop.services.impl;

import com.bookshop.domain.entities.BookEntity;
import com.bookshop.exception.ResourceNotFoundException;
import com.bookshop.exception.InvalidOperationException;
import com.bookshop.repositories.BookRepository;
import com.bookshop.services.BookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = false)
    public BookEntity createUpdateBook(String isbn, BookEntity book) {
        log.info("Creating or updating book with ISBN: {}", isbn);
        try {
            book.setIsbn(isbn);
            BookEntity saved = bookRepository.save(book);
            log.info("Book successfully saved with ISBN: {}", isbn);
            return saved;
        } catch (Exception e) {
            log.error("Error saving book with ISBN: {}", isbn, e);
            throw new RuntimeException("Failed to save book", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookEntity> findAll() {
        log.debug("Fetching all books");
        return bookRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookEntity> findAll(Pageable pageable) {
        log.debug("Fetching books with pagination: {}", pageable);
        return bookRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BookEntity> findOne(String isbn) {
        log.debug("Fetching book with ISBN: {}", isbn);
        return bookRepository.findById(isbn);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isExists(String isbn) {
        log.debug("Checking if book exists with ISBN: {}", isbn);
        return bookRepository.existsById(isbn);
    }

    @Override
    @Transactional(readOnly = false)
    public BookEntity partialUpdate(String isbn, BookEntity bookEntity) {
        log.info("Partially updating book with ISBN: {}", isbn);
        
        if (!bookRepository.existsById(isbn)) {
            log.warn("Book not found with ISBN: {}", isbn);
            throw new ResourceNotFoundException("Book", "ISBN", isbn);
        }

        return bookRepository.findById(isbn).map(existingBook -> {
            if (bookEntity.getTitle() != null && !bookEntity.getTitle().trim().isEmpty()) {
                log.debug("Updating book title from '{}' to '{}'", 
                    existingBook.getTitle(), bookEntity.getTitle());
                existingBook.setTitle(bookEntity.getTitle());
            }
            
            if (bookEntity.getAuthorEntity() != null) {
                log.debug("Updating book author to: {}", bookEntity.getAuthorEntity().getId());
                existingBook.setAuthorEntity(bookEntity.getAuthorEntity());
            }
            
            if (bookEntity.getCategory() != null) {
                log.debug("Updating book category to: {}", bookEntity.getCategory().getId());
                existingBook.setCategory(bookEntity.getCategory());
            }
            
            BookEntity updated = bookRepository.save(existingBook);
            log.info("Book with ISBN {} successfully updated", isbn);
            return updated;
        }).orElseThrow(() -> {
            log.error("Unexpected error: Book disappeared after existence check");
            return new InvalidOperationException("Book was deleted during update operation");
        });
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(String isbn) {
        log.info("Deleting book with ISBN: {}", isbn);
        
        if (!bookRepository.existsById(isbn)) {
            log.warn("Attempt to delete non-existent book with ISBN: {}", isbn);
            throw new ResourceNotFoundException("Book", "ISBN", isbn);
        }
        
        bookRepository.deleteById(isbn);
        log.info("Book with ISBN {} successfully deleted", isbn);
    }
}
```

---

## 3. AUDITORÍA CON JPA

### Crear entidad base con auditoría

**Archivo:** `src/main/java/com/bookshop/domain/entities/BaseEntity.java`
```java
package com.bookshop.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseEntity {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(length = 100)
    private String updatedBy;
}
```

### Actualizar BookEntity para heredar de BaseEntity

**Archivo:** `src/main/java/com/bookshop/domain/entities/BookEntity.java`
```java
package com.bookshop.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "books")
@EqualsAndHashCode(exclude = "authorEntity")
public class BookEntity extends BaseEntity {

    @Id
    private String isbn;

    @Column(nullable = false)
    private String title;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "author_id")
    private AuthorEntity authorEntity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
}
```

### Configurar auditoría en Application

**Archivo:** `src/main/java/com/bookshop/BookShopApplication.java`
```java
package com.bookshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class BookShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookShopApplication.class, args);
    }

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return Optional.of(authentication.getName());
            }
            return Optional.of("SYSTEM");
        };
    }
}
```

---

## 4. LOGGING CONFIGURADO

### Actualizar logback-spring.xml

**Archivo:** `src/main/resources/logback-spring.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}/}spring.log}"/>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <encoder>
            <pattern>
                %d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n
            </pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>
                %d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n
            </pattern>
        </encoder>
    </appender>

    <logger name="com.bookshop" level="DEBUG"/>
    <logger name="org.springframework.web" level="INFO"/>
    <logger name="org.springframework.security" level="INFO"/>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

### Actualizar application.yml para logging

**Archivo:** `src/main/resources/application.yml`
```yaml
logging:
  level:
    root: INFO
    com.bookshop: DEBUG
    org.springframework.web: INFO
    org.springframework.security: INFO
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

---

## 5. TESTS DE INTEGRACIÓN

**Archivo:** `src/test/java/com/bookshop/services/BookServiceIntegrationTest.java`
```java
package com.bookshop.services;

import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.exception.ResourceNotFoundException;
import com.bookshop.repositories.AuthorRepository;
import com.bookshop.repositories.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BookServiceIntegrationTest {

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    private BookEntity testBook;
    private AuthorEntity testAuthor;

    @BeforeEach
    void setUp() {
        testAuthor = AuthorEntity.builder()
            .name("Test Author")
            .birthDate(new Date())
            .nationality("Test Country")
            .biography("Test bio")
            .build();
        testAuthor = authorRepository.save(testAuthor);

        testBook = BookEntity.builder()
            .isbn("1234567890")
            .title("Test Book")
            .authorEntity(testAuthor)
            .build();
    }

    @Test
    void testCreateBook_Success() {
        BookEntity saved = bookService.createUpdateBook("1234567890", testBook);
        
        assertNotNull(saved);
        assertEquals("1234567890", saved.getIsbn());
        assertEquals("Test Book", saved.getTitle());
        assertTrue(bookRepository.existsById("1234567890"));
    }

    @Test
    void testFindBook_Success() {
        bookRepository.save(testBook);
        Optional<BookEntity> found = bookService.findOne("1234567890");
        
        assertTrue(found.isPresent());
        assertEquals("Test Book", found.get().getTitle());
    }

    @Test
    void testFindBook_NotFound() {
        Optional<BookEntity> found = bookService.findOne("nonexistent");
        
        assertTrue(found.isEmpty());
    }

    @Test
    void testPartialUpdate_Success() {
        bookRepository.save(testBook);
        
        BookEntity update = new BookEntity();
        update.setTitle("Updated Title");
        
        BookEntity updated = bookService.partialUpdate("1234567890", update);
        
        assertEquals("Updated Title", updated.getTitle());
    }

    @Test
    void testPartialUpdate_NotFound() {
        BookEntity update = new BookEntity();
        update.setTitle("Updated Title");
        
        assertThrows(ResourceNotFoundException.class, 
            () -> bookService.partialUpdate("nonexistent", update));
    }

    @Test
    void testDeleteBook_Success() {
        bookRepository.save(testBook);
        
        bookService.delete("1234567890");
        
        assertFalse(bookRepository.existsById("1234567890"));
    }

    @Test
    void testDeleteBook_NotFound() {
        assertThrows(ResourceNotFoundException.class, 
            () -> bookService.delete("nonexistent"));
    }
}
```

### Crear perfil de test

**Archivo:** `src/test/resources/application-test.yml`
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: false

jwt:
  secret: test-secret-key-that-is-at-least-32-characters-long
  expiration: 3600000

logging:
  level:
    com.bookshop: DEBUG
```

---

## 6. CACHING

### Habilitar caché

**Archivo:** `src/main/java/com/bookshop/config/CacheConfig.java`
```java
package com.bookshop.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("books", "authors", "categories", "users");
    }
}
```

### Usar caché en servicios

**Archivo:** `src/main/java/com/bookshop/services/impl/BookServiceImpl.java` (actualizar métodos)
```java
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;

@Service
@Transactional
@Slf4j
public class BookServiceImpl implements BookService {

    @Override
    @Transactional(readOnly = false)
    @CacheEvict(value = "books", allEntries = true)
    public BookEntity createUpdateBook(String isbn, BookEntity book) {
        // ... implementación
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "books", key = "#isbn")
    public Optional<BookEntity> findOne(String isbn) {
        log.debug("Fetching book with ISBN: {} (from database)", isbn);
        return bookRepository.findById(isbn);
    }

    @Override
    @Transactional(readOnly = false)
    @CacheEvict(value = "books", key = "#isbn")
    public BookEntity partialUpdate(String isbn, BookEntity bookEntity) {
        // ... implementación
    }

    @Override
    @Transactional(readOnly = false)
    @CacheEvict(value = "books", key = "#isbn")
    public void delete(String isbn) {
        // ... implementación
    }
}
```

---

## 7. RATE LIMITING

### Agregar dependencia en pom.xml

```xml
<dependency>
    <groupId>io.github.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>7.6.0</version>
</dependency>
```

### Implementar filtro de rate limiting

**Archivo:** `src/main/java/com/bookshop/config/RateLimitingFilter.java`
```java
package com.bookshop.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Obtener IP del cliente
        String clientIP = getClientIP(request);
        
        // Obtener o crear bucket para el cliente
        Bucket bucket = buckets.computeIfAbsent(clientIP, k -> {
            Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
            return Bucket4j.builder()
                .addLimit(limit)
                .build();
        });

        // Consumir un token
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP: {}", clientIP);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // No aplicar rate limiting a health checks y documentación
        String path = request.getRequestURI();
        return path.startsWith("/actuator") || path.startsWith("/swagger-ui") || 
               path.startsWith("/api-docs");
    }
}
```

---

## 8. CONTROL DE ACCESO BASADO EN ROLES (RBAC)

### Actualizar SecurityConfig

**Archivo:** `src/main/java/com/bookshop/config/SecurityConfig.java` (actualizar)
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Agregar esta anotación
public class SecurityConfig {

    // ... código existente ...

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ... CORS, CSRF, etc ...
            .authorizeHttpRequests(auth -> auth
                // Públicos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/swagger-resources/**",
                    "/webjars/**")
                .permitAll()
                .requestMatchers("/actuator/health/**").permitAll()
                
                // Endpoints de lectura: cualquier usuario autenticado
                .requestMatchers("GET", "/api/books/**").authenticated()
                .requestMatchers("GET", "/api/authors/**").authenticated()
                .requestMatchers("GET", "/api/categories/**").authenticated()
                
                // Endpoints de escritura: solo ADMIN y MODERATOR
                .requestMatchers("POST", "/api/books/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("PUT", "/api/books/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("PATCH", "/api/books/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("DELETE", "/api/books/**").hasRole("ADMIN")
                
                // Cualquier otra solicitud requiere autenticación
                .anyRequest().authenticated())
            // ... resto de configuración ...
        return http.build();
    }
}
```

### Uso de anotaciones en controladores

**Archivo:** `src/main/java/com/bookshop/controller/BookController.java` (actualizar)
```java
@RestController
@RequestMapping("/api/books")
@Slf4j
public class BookController {

    // ... campos ...

    @GetMapping
    public List<BookDto> listBooks() {
        // Acceso público después de autenticarse
        return bookService.findAll().stream()
            .map(bookMapper::mapTo)
            .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<BookDto> createBook(@Valid @RequestBody BookDto bookDto) {
        log.info("Creating new book");
        BookEntity bookEntity = bookMapper.mapFrom(bookDto);
        BookEntity saved = bookService.createUpdateBook(bookEntity.getIsbn(), bookEntity);
        return new ResponseEntity<>(bookMapper.mapTo(saved), HttpStatus.CREATED);
    }

    @PutMapping("/{isbn}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable String isbn,
            @Valid @RequestBody BookDto bookDto) {
        log.info("Updating book with ISBN: {}", isbn);
        // ... implementación ...
    }

    @DeleteMapping("/{isbn}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String isbn) {
        log.info("Deleting book with ISBN: {}", isbn);
        bookService.delete(isbn);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Checklist de Implementación

- [ ] Crear excepciones personalizadas (ResourceNotFoundException, InvalidOperationException)
- [ ] Actualizar GlobalExceptionHandler
- [ ] Agregar @Transactional a servicios
- [ ] Agregar logging con @Slf4j
- [ ] Crear entidad BaseEntity con auditoría
- [ ] Actualizar entidades para heredar de BaseEntity
- [ ] Crear logback-spring.xml
- [ ] Crear tests de integración
- [ ] Habilitar caché (CacheConfig)
- [ ] Agregar @Cacheable/@CacheEvict en servicios
- [ ] Agregar bucket4j para rate limiting
- [ ] Habilitar @EnableMethodSecurity
- [ ] Agregar @PreAuthorize en controladores
- [ ] Crear perfil test (application-test.yml)
- [ ] Ejecutar `mvn clean test` para validar

---

## Comando para ejecutar tests

```bash
mvn clean test
mvn test -Dtest=BookServiceIntegrationTest
```

