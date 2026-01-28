package com.bookshop.services.impl;

import com.bookshop.domain.dto.UserRegisterRequest;
import com.bookshop.domain.entities.Role;
import com.bookshop.domain.entities.User;
import com.bookshop.repositories.RoleRepository;
import com.bookshop.repositories.UserRepository;
import com.bookshop.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * Constructor de la clase.
   * 
   * @param userRepository  Repositorio de usuarios
   * @param roleRepository  Repositorio de roles
   * @param passwordEncoder Codificador de contraseñas
   */
  public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * 
   * @param request Objeto con los datos del usuario a registrar
   * @return El usuario registrado
   * @throws RuntimeException Si el nombre de usuario ya existe
   */
  @Override
  public User registerUser(UserRegisterRequest request) {
    if (userRepository.existsByUsername(request.username())) {
      throw new RuntimeException("Username already exists!");
    }

    User user = new User();
    user.setUsername(request.username());
    user.setPassword(passwordEncoder.encode(request.password()));

    Set<Role> roles = new HashSet<>();
    Role userRole = roleRepository.findByName("ROLE_USER")
        .orElseThrow(() -> new RuntimeException("Role USER not found!"));
    roles.add(userRole);

    user.setRoles(roles);
    return userRepository.save(user);
  }
}