package com.bookshop.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bookshop.domain.entities.CategoryEntity;

@Repository
public interface CategoryRepository extends CrudRepository<CategoryEntity, Long> {
} 