package com.bookshop.services;

import com.bookshop.domain.dto.AuthResponse;
import com.bookshop.domain.dto.LoginRequest;

public interface AuthService {
  AuthResponse login(LoginRequest request);
  void logout(String token);
}