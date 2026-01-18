package com.bookshop.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenProvider jwtTokenProvider;
  private final UserDetailsService userDetailsService;

  /**
   * Constructor que inicializa el filtro con el proveedor de tokens JWT y el servicio de detalles de usuario.
   * @param jwtTokenProvider El proveedor de tokens JWT
   * @param userDetailsService El servicio de detalles de usuario
   */
  public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
      UserDetailsService userDetailsService) {
    this.jwtTokenProvider = jwtTokenProvider;
    this.userDetailsService = userDetailsService;
  }

  /**
   * Filtra cada solicitud HTTP para verificar la autenticación del usuario.
   * @param request La solicitud HTTP entrante
   * @param response La respuesta HTTP
   * @param filterChain La cadena de filtros
   * @throws ServletException Si ocurre un error en el filtro
   * @throws IOException Si hay problemas con la lectura/escritura de la solicitud
   */
  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    // Resuelve el token JWT de la solicitud
    String token = jwtTokenProvider.resolveToken(request);

    // Verifica si el token es válido y no es nulo
    if (token != null && jwtTokenProvider.validateToken(token)) {
      // Obtiene el nombre de usuario del token
      String username = jwtTokenProvider.getUsername(token);
      
      // Carga los detalles del usuario desde el servicio de detalles de usuario
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);

      // Crea un token de autenticación con los detalles del usuario
      UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(
              userDetails,
              null,
              userDetails.getAuthorities());

      // Establece los detalles de la autenticación en el contexto de seguridad
      authentication.setDetails(
          new WebAuthenticationDetailsSource().buildDetails(request));

      // Establece la autenticación en el contexto de seguridad
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // Continúa con la cadena de filtros
    filterChain.doFilter(request, response);
  }
}