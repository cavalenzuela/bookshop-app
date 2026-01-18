package com.bookshop.controller;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bookshop.domain.dto.AuthResponse;
import com.bookshop.domain.dto.LoginRequest;
import com.bookshop.domain.dto.UserRegisterRequest;
import com.bookshop.domain.entities.User;
import com.bookshop.services.AuthService;
import com.bookshop.services.UserService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private LoginRequest loginRequest;
    private AuthResponse authResponse;
    private UserRegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        authResponse = new AuthResponse();
        authResponse.setToken("test-token");
        authResponse.setMessage("Login successful");

        registerRequest = new UserRegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setPassword("password123");

        user = new User();
        user.setUsername("newuser");
    }

    /**
     * Verifica que el método login funcione correctamente cuando se proporcionan credenciales válidas.
     * Debe retornar un AuthResponse con un token de autenticación y mensaje de éxito.
     * Se agrega una linea para verificar github webhook
     */
    @Test
    void login_ShouldReturnAuthResponse() {
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authResponse);
        verify(authService).login(loginRequest);
    }

    /**
     * Verifica que el método logout funcione correctamente cuando se proporciona un token válido.
     * Debe retornar un mensaje de éxito y eliminar la sesión del usuario.
     */
    @Test
    void logout_ShouldReturnSuccessMessage() {
        doNothing().when(authService).logout(anyString());

        ResponseEntity<String> response = authController.logout("Bearer test-token");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Logged out successfully!");
        verify(authService).logout("test-token");
    }

    /**
     * Verifica que el método register funcione correctamente cuando se proporcionan datos de registro válidos.
     * Debe crear un nuevo usuario y retornar un mensaje de éxito.
     */
    @Test
    void register_ShouldReturnSuccessMessage() {
        when(userService.registerUser(any(UserRegisterRequest.class))).thenReturn(user);

        ResponseEntity<String> response = authController.register(registerRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("User registered successfully!");
        verify(userService).registerUser(registerRequest);
    }
}