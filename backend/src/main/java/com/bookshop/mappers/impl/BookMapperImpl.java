package com.bookshop.mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.bookshop.domain.dto.BookDto;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.mappers.Mapper;

@Component
public class BookMapperImpl implements Mapper<BookEntity, BookDto> {

  private final ModelMapper modelMapper;

  public BookMapperImpl(ModelMapper modelMapper) {
    this.modelMapper = modelMapper;
    // Configuración explícita para asegurar el mapeo de category si es necesario
    // modelMapper.typeMap(BookEntity.class, BookDto.class).addMappings(mapper -> mapper.map(BookEntity::getCategory, BookDto::setCategory));
  }

  @Override
  public BookDto mapTo(BookEntity bookEntity) {
    return modelMapper.map(bookEntity, BookDto.class);
  }

  @Override
  public BookEntity mapFrom(BookDto bookDto) {
    return modelMapper.map(bookDto, BookEntity.class);
  }
}
