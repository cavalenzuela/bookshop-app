package com.bookshop.services.impl;

import com.bookshop.domain.dto.AuthResponse;
import com.bookshop.domain.dto.LoginRequest;
import com.bookshop.security.JwtTokenProvider;
import com.bookshop.services.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
    this.authenticationManager = authenticationManager;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  /**
   * Autentica un usuario y genera un token JWT.
   * 
   * @param request Objeto que contiene las credenciales de login
   * @return Respuesta de autenticación con el token JWT generado
   * @throws RuntimeException Si las credenciales son inválidas
   */
  @Override
  public AuthResponse login(LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));

    String token = jwtTokenProvider.generateToken(authentication);
    return new AuthResponse(token, request.username(), "Login successful!");
  }

  /**
   * Invalida un token JWT existente, cerrando la sesión del usuario.
   * 
   * @param token El token JWT a invalidar
   */
  @Override
  public void logout(String token) {
    jwtTokenProvider.invalidateToken(token);
  }
}