package com.bookshop.services;

import com.bookshop.domain.dto.UserRegisterRequest;
import com.bookshop.domain.entities.User;

public interface UserService {
  User registerUser(UserRegisterRequest request);
}