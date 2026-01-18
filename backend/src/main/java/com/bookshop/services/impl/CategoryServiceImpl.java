package com.bookshop.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.repositories.CategoryRepository;
import com.bookshop.services.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryEntity createCategory(CategoryEntity categoryEntity) {
        return categoryRepository.save(categoryEntity);
    }

    @Override
    public Optional<CategoryEntity> getCategory(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public List<CategoryEntity> listCategories() {
        return StreamSupport.stream(categoryRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryEntity updateCategory(Long id, CategoryEntity categoryEntity) {
        categoryEntity.setId(id);
        return categoryRepository.save(categoryEntity);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
} 