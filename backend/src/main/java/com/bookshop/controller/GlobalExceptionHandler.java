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

/**
 * Manejador global de excepciones para la aplicación.
 * Esta clase captura las excepciones lanzadas por los controladores y las
 * transforma
 * en respuestas HTTP consistentes con información útil sobre el error.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja errores de validación de argumentos de métodos (p. ej., fallos
     * en @Valid).
     * Extrae los nombres de los campos y los mensajes de error configurados en los
     * DTOs.
     *
     * @param ex La excepción de validación capturada
     * @return Un ResponseEntity que contiene un mapa con los campos y sus errores
     *         (400 Bad Request)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja todas las demás excepciones que no tienen un manejador específico.
     * Proporciona una respuesta de error genérica para evitar exponer detalles
     * internos sensibles.
     *
     * @param ex      La excepción capturada
     * @param request El objeto de la solicitud web para obtener detalles del path
     * @return Un ResponseEntity con los detalles del error interno (500 Internal
     *         Server Error)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", ex.getMessage());
        response.put("timestamp", LocalDateTime.now());
        response.put("path", request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
