package com.bookshop.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookDto(
    @NotBlank(message = "ISBN is required") String isbn,

    @NotBlank(message = "Title is required") String title,

    @NotNull(message = "Author is required") AuthorDto author,

    @NotNull(message = "Category is required") CategoryDto category) {
}