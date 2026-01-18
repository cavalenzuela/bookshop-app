package com.bookshop.mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;

@Component
public class CategoryMapperImpl implements Mapper<CategoryEntity, CategoryDto> {
    private final ModelMapper modelMapper;

    public CategoryMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public CategoryDto mapTo(CategoryEntity entity) {
        return modelMapper.map(entity, CategoryDto.class);
    }

    @Override
    public CategoryEntity mapFrom(CategoryDto dto) {
        return modelMapper.map(dto, CategoryEntity.class);
    }
} 