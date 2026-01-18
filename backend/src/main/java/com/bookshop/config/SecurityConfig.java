package com.bookshop.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.bookshop.security.JwtAuthenticationFilter;

/**
 * Configuración de seguridad de la aplicación.
 * Esta clase define la configuración de seguridad de Spring Security,
 * incluyendo la gestión de autenticación, autorización, CORS y filtros JWT.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
  }

  /**
   * Configura la cadena de filtros de seguridad de la aplicación.
   * Define las reglas de seguridad, incluyendo:
   * - Configuración CORS
   * - Deshabilitación de CSRF
   * - Reglas de autorización para endpoints
   * - Gestión de sesiones sin estado
   * - Integración del filtro JWT
   *
   * @param http Configuración de seguridad HTTP
   * @return SecurityFilterChain configurada
   * @throws Exception si hay un error en la configuración
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/api-docs/**", "/v3/api-docs/**").permitAll()
            .requestMatchers("/swagger-resources/**", "/webjars/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  /**
   * Configura la política CORS (Cross-Origin Resource Sharing) de la aplicación.
   * Define los orígenes, métodos y encabezados permitidos para las solicitudes cross-origin.
   * 
   * @return CorsConfigurationSource configurada con las políticas CORS
   */
  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:8080", "http://localhost:8282")); // Orígenes permitidos
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*")); // O puedes especificar: "Authorization", "Content-Type", etc.
    configuration.setAllowCredentials(true); // Importante si usas cookies o autenticación

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Aplicar a todos los endpoints
    return source;
  }

  /**
   * Proporciona el AuthenticationManager para la aplicación.
   * Este bean es necesario para la autenticación de usuarios.
   *
   * @param config Configuración de autenticación
   * @return AuthenticationManager configurado
   * @throws Exception si hay un error en la configuración
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  /**
   * Proporciona el codificador de contraseñas para la aplicación.
   * Utiliza BCrypt como algoritmo de hash para las contraseñas.
   *
   * @return PasswordEncoder configurado con BCrypt
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}