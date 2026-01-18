package com.bookshop.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.CategoryService;

/**
 * Controlador para la gestión de categorías.
 * Proporciona endpoints CRUD para la gestión de categorías en el sistema.
 */
@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final Mapper<CategoryEntity, CategoryDto> categoryMapper;

    public CategoryController(Mapper<CategoryEntity, CategoryDto> categoryMapper, CategoryService categoryService) {
        this.categoryMapper = categoryMapper;
        this.categoryService = categoryService;
    }

    /**
     * Crea una nueva categoría en el sistema.
     * Convierte el DTO a entidad, guarda la categoría y retorna el DTO creado.
     *
     * @param categoryDto Datos de la categoría a crear
     * @return ResponseEntity con la categoría creada y estado CREATED
     */
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryEntity entity = categoryMapper.mapFrom(categoryDto);
        CategoryEntity saved = categoryService.createCategory(entity);
        CategoryDto result = categoryMapper.mapTo(saved);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    /**
     * Obtiene una categoría específica por su ID.
     * Retorna la categoría si existe, o NOT_FOUND si no existe.
     *
     * @param id ID de la categoría a buscar
     * @return ResponseEntity con la categoría encontrada o NOT_FOUND
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {
        Optional<CategoryEntity> category = categoryService.getCategory(id);
        return category.map(entity -> new ResponseEntity<>(categoryMapper.mapTo(entity), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Obtiene la lista de todas las categorías.
     * Convierte cada entidad a DTO antes de retornarla.
     *
     * @return Lista de DTOs de categorías
     */
    @GetMapping
    public List<CategoryDto> listCategories() {
        return categoryService.listCategories().stream()
                .map(categoryMapper::mapTo)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza completamente una categoría existente.
     * Reemplaza todos los campos de la categoría con los nuevos datos.
     *
     * @param id ID de la categoría a actualizar
     * @param categoryDto Nuevos datos de la categoría
     * @return ResponseEntity con la categoría actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        CategoryEntity entity = categoryMapper.mapFrom(categoryDto);
        CategoryEntity updated = categoryService.updateCategory(id, entity);
        CategoryDto result = categoryMapper.mapTo(updated);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Elimina una categoría del sistema.
     * Retorna NO_CONTENT si la eliminación fue exitosa.
     *
     * @param id ID de la categoría a eliminar
     * @return ResponseEntity con estado NO_CONTENT
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 