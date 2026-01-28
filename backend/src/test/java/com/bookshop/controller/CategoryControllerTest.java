package com.bookshop.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.CategoryService;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @Mock
    private Mapper<CategoryEntity, CategoryDto> categoryMapper;

    @InjectMocks
    private CategoryController categoryController;

    private CategoryDto categoryDto;
    private CategoryEntity categoryEntity;

    @BeforeEach
    void setUp() {
        categoryDto = new CategoryDto(
                1L,
                "Test Category");

        categoryEntity = CategoryEntity.builder()
                .id(1L)
                .name("Test Category")
                .build();
    }

    @Test
    void createCategory_ShouldCreateNewCategory() {
        when(categoryMapper.mapFrom(any(CategoryDto.class))).thenReturn(categoryEntity);
        when(categoryService.createCategory(any(CategoryEntity.class))).thenReturn(categoryEntity);
        when(categoryMapper.mapTo(any(CategoryEntity.class))).thenReturn(categoryDto);

        ResponseEntity<CategoryDto> response = categoryController.createCategory(categoryDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(categoryDto);
        verify(categoryService).createCategory(categoryEntity);
    }

    @Test
    void getCategory_WhenCategoryExists_ShouldReturnCategory() {
        when(categoryService.getCategory(anyLong())).thenReturn(Optional.of(categoryEntity));
        when(categoryMapper.mapTo(any(CategoryEntity.class))).thenReturn(categoryDto);

        ResponseEntity<CategoryDto> response = categoryController.getCategory(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(categoryDto);
        verify(categoryService).getCategory(1L);
    }

    @Test
    void getCategory_WhenCategoryDoesNotExist_ShouldReturnNotFound() {
        when(categoryService.getCategory(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<CategoryDto> response = categoryController.getCategory(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(categoryService).getCategory(1L);
    }

    @Test
    void listCategories_ShouldReturnAllCategories() {
        List<CategoryEntity> categoryEntities = Arrays.asList(categoryEntity);
        List<CategoryDto> categoryDtos = Arrays.asList(categoryDto);

        when(categoryService.listCategories()).thenReturn(categoryEntities);
        when(categoryMapper.mapTo(any(CategoryEntity.class))).thenReturn(categoryDto);

        List<CategoryDto> response = categoryController.listCategories();

        assertThat(response).isEqualTo(categoryDtos);
        verify(categoryService).listCategories();
    }

    @Test
    void updateCategory_ShouldUpdateCategory() {
        when(categoryMapper.mapFrom(any(CategoryDto.class))).thenReturn(categoryEntity);
        when(categoryService.updateCategory(anyLong(), any(CategoryEntity.class))).thenReturn(categoryEntity);
        when(categoryMapper.mapTo(any(CategoryEntity.class))).thenReturn(categoryDto);

        ResponseEntity<CategoryDto> response = categoryController.updateCategory(1L, categoryDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(categoryDto);
        verify(categoryService).updateCategory(1L, categoryEntity);
    }

    @Test
    void deleteCategory_ShouldDeleteCategory() {
        doNothing().when(categoryService).deleteCategory(anyLong());

        ResponseEntity<Void> response = categoryController.deleteCategory(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(categoryService).deleteCategory(1L);
    }
}