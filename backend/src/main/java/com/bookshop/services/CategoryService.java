package com.bookshop.services;

import java.util.List;
import java.util.Optional;

import com.bookshop.domain.entities.CategoryEntity;

public interface CategoryService {
    CategoryEntity createCategory(CategoryEntity categoryEntity);
    Optional<CategoryEntity> getCategory(Long id);
    List<CategoryEntity> listCategories();
    CategoryEntity updateCategory(Long id, CategoryEntity categoryEntity);
    void deleteCategory(Long id);
} 