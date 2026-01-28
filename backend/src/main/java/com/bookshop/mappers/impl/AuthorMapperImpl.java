package com.bookshop.mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.mappers.Mapper;

@Component
public class AuthorMapperImpl implements Mapper<AuthorEntity, AuthorDto> {

    private final ModelMapper modelMapper;

    public AuthorMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        // ModelMapper mapea automáticamente los campos si los nombres coinciden
    }

    @Override
    public AuthorDto mapTo(AuthorEntity authorEntity) {
        if (authorEntity == null) {
            return null;
        }
        return new AuthorDto(
                authorEntity.getId(),
                authorEntity.getName(),
                authorEntity.getBirthDate(),
                authorEntity.getNationality(),
                authorEntity.getBiography());
    }

    @Override
    public AuthorEntity mapFrom(AuthorDto authorDto) {
        return modelMapper.map(authorDto, AuthorEntity.class);
    }
}
