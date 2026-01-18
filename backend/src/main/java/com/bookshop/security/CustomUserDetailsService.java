package com.bookshop.security;

import com.bookshop.domain.entities.User;
import com.bookshop.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  /**
   * Constructor que inyecta el repositorio de usuarios.
   * @param userRepository El repositorio de usuarios
   */
  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Carga los detalles de un usuario basado en su nombre de usuario.
   * @param username El nombre de usuario del usuario a buscar
   * @return UserDetails con la información del usuario
   * @throws UsernameNotFoundException Si el usuario no es encontrado
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // User ya implementa UserDetails
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
  }
}