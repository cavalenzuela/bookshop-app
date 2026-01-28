package com.bookshop.domain.dto;

public record AuthResponse(
    String token,
    String username,
    String message) {
}