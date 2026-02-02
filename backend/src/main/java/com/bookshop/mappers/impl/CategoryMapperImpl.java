package com.bookshop.mappers.impl;

import org.springframework.stereotype.Component;
import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;

@Component
public class CategoryMapperImpl implements Mapper<CategoryEntity, CategoryDto> {

    @Override
    public CategoryDto mapTo(CategoryEntity entity) {
        if (entity == null) return null;

        return new CategoryDto(
            entity.getId(),
            entity.getName());
    }

    @Override
    public CategoryEntity mapFrom(CategoryDto dto) {
        if (dto == null) return null;

        CategoryEntity entity = new CategoryEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        return entity;
    }
}