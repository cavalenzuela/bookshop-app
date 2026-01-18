package com.bookshop.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Proveedor de tokens JWT para la autenticación de usuarios.
 */
@Component
public class JwtTokenProvider {
  private final SecretKey key;
  private final long validityInMilliseconds;

  public JwtTokenProvider(
      @Value("${jwt.secret}") String jwtSecret,
      @Value("${jwt.expiration}") long jwtExpiration) {
    this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    this.validityInMilliseconds = jwtExpiration;
  }

  /**
   * Genera un token JWT para un usuario autenticado.
   * @param authentication Objeto de autenticación del usuario
   * @return Token JWT generado
   */
  public String generateToken(Authentication authentication) {
    return Jwts.builder()
        .setSubject(authentication.getName())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + validityInMilliseconds))
        .signWith(key)
        .compact();
  }

  /**
   * Extrae el token JWT de la cabecera Authorization de una solicitud HTTP.
   * @param request La solicitud HTTP
   * @return El token JWT sin el prefijo "Bearer " o null si no existe
   */
  public String resolveToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }

  /**
   * Valida si un token JWT es válido.
   * @param token El token JWT a validar
   * @return true si el token es válido, false en caso contrario
   */
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  /**
   * Obtiene el nombre de usuario desde un token JWT válido.
   * @param token El token JWT
   * @return El nombre de usuario contenido en el token
   */
  public String getUsername(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  /**
   * Método opcional para invalidar un token JWT.
   * @param token El token JWT a invalidar
   */
  public void invalidateToken(String token) {
    // Implementación opcional para manejar tokens revocados
  }
}