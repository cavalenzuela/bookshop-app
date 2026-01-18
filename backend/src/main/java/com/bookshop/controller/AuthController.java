package com.bookshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookshop.domain.dto.AuthResponse;
import com.bookshop.domain.dto.LoginRequest;
import com.bookshop.domain.dto.UserRegisterRequest;
import com.bookshop.services.AuthService;
import com.bookshop.services.UserService;

/**
 * Controlador para la gestión de autenticación y autorización.
 * Proporciona endpoints para el registro, inicio y cierre de sesión de usuarios.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;
  private final UserService userService;

  public AuthController(AuthService authService, UserService userService) {
    this.authService = authService;
    this.userService = userService;
  }

  /**
   * Autentica a un usuario y genera un token JWT.
   * Valida las credenciales y retorna un token de acceso si son correctas.
   *
   * @param request Datos de inicio de sesión (username y password)
   * @return ResponseEntity con el token JWT y un mensaje de éxito
   */
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  /**
   * Cierra la sesión del usuario actual.
   * Invalida el token JWT proporcionado.
   *
   * @param token Token JWT a invalidar
   * @return ResponseEntity con un mensaje de éxito
   */
  @PostMapping("/logout")
  public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
    authService.logout(token.replace("Bearer ", ""));
    return ResponseEntity.ok("Logged out successfully!");
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * Valida los datos de registro y crea una nueva cuenta de usuario.
   *
   * @param request Datos de registro del usuario (username y password)
   * @return ResponseEntity con un mensaje de éxito o error
   */
  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody UserRegisterRequest request) {
    userService.registerUser(request);
    return ResponseEntity.ok("User registered successfully!");
  }
}