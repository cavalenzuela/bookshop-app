package com.bookshop.mappers.impl;

import org.springframework.stereotype.Component;
import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.mappers.Mapper;

@Component
public class AuthorMapperImpl implements Mapper<AuthorEntity, AuthorDto> {

    @Override
    public AuthorDto mapTo(AuthorEntity authorEntity) {
        if (authorEntity == null) return null;

        return new AuthorDto(
            authorEntity.getId(),
            authorEntity.getName(),
            authorEntity.getBirthDate(),
            authorEntity.getNationality(),
            authorEntity.getBiography());
    }

    @Override
    public AuthorEntity mapFrom(AuthorDto authorDto) {
        if (authorDto == null) return null;

        AuthorEntity entity = new AuthorEntity();
        entity.setId(authorDto.id());
        entity.setName(authorDto.name());
        entity.setBirthDate(authorDto.birthDate());
        entity.setNationality(authorDto.nationality());
        entity.setBiography(authorDto.biography());
        return entity;
    }
}