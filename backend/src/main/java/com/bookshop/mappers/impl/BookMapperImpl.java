package com.bookshop.mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.dto.BookDto;
import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;

@Component
public class BookMapperImpl implements Mapper<BookEntity, BookDto> {

  private final ModelMapper modelMapper;
  private final Mapper<AuthorEntity, AuthorDto> authorMapper;
  private final Mapper<CategoryEntity, CategoryDto> categoryMapper;

  public BookMapperImpl(
      ModelMapper modelMapper,
      Mapper<AuthorEntity, AuthorDto> authorMapper,
      Mapper<CategoryEntity, CategoryDto> categoryMapper) {
    this.modelMapper = modelMapper;
    this.authorMapper = authorMapper;
    this.categoryMapper = categoryMapper;
  }

  @Override
  public BookDto mapTo(BookEntity bookEntity) {
    if (bookEntity == null) {
      return null;
    }
    return new BookDto(
        bookEntity.getIsbn(),
        bookEntity.getTitle(),
        authorMapper.mapTo(bookEntity.getAuthorEntity()),
        categoryMapper.mapTo(bookEntity.getCategory()));
  }

  @Override
  public BookEntity mapFrom(BookDto bookDto) {
    return modelMapper.map(bookDto, BookEntity.class);
  }
}
