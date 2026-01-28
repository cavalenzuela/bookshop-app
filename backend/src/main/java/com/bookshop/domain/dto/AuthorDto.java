package com.bookshop.domain.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Date;

public record AuthorDto(
    Long id,

    @NotBlank(message = "Name is required") String name,

    Date birthDate,

    String nationality,

    String biography) {
}
