package com.bookshop.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.CategoryService;

/**
 * Controlador para la gestión de categorías.
 * Proporciona endpoints CRUD bajo el prefijo /api/categories.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final Mapper<CategoryEntity, CategoryDto> categoryMapper;

    public CategoryController(Mapper<CategoryEntity, CategoryDto> categoryMapper, CategoryService categoryService) {
        this.categoryMapper = categoryMapper;
        this.categoryService = categoryService;
    }

    /**
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        CategoryEntity entity = categoryMapper.mapFrom(categoryDto);
        CategoryEntity saved = categoryService.createCategory(entity);
        return new ResponseEntity<>(categoryMapper.mapTo(saved), HttpStatus.CREATED);
    }

    /**
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        Optional<CategoryEntity> category = categoryService.getCategory(id);
        return category.map(entity -> new ResponseEntity<>(categoryMapper.mapTo(entity), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * GET /api/categories
     */
    @GetMapping
    public List<CategoryDto> listCategories() {
        return categoryService.listCategories().stream()
                .map(categoryMapper::mapTo)
                .collect(Collectors.toList());
    }

    /**
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id,
            @Valid @RequestBody CategoryDto categoryDto) {
        CategoryEntity entity = categoryMapper.mapFrom(categoryDto);
        // Ensure ID is passed correctly, entity might not have ID if DTO didn't have it
        entity.setId(id);
        CategoryEntity updated = categoryService.updateCategory(id, entity);
        return new ResponseEntity<>(categoryMapper.mapTo(updated), HttpStatus.OK);
    }

    /**
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}