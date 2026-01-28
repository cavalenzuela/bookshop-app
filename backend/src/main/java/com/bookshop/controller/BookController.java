package com.bookshop.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookshop.domain.dto.BookDto;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.BookService;

/**
 * Controlador para la gestión de libros.
 * Proporciona endpoints CRUD bajo el prefijo /api/books.
 */
@RestController
@RequestMapping("/api/books") // Define la ruta base para todos los endpoints de esta clase
public class BookController {

  private final BookService bookService;
  private final Mapper<BookEntity, BookDto> bookMapper;

  public BookController(Mapper<BookEntity, BookDto> bookMapper, BookService bookService) {
    this.bookMapper = bookMapper;
    this.bookService = bookService;
  }

  /**
   * GET /api/books
   */
  @GetMapping
  public List<BookDto> listBooks() {
    List<BookEntity> books = bookService.findAll();
    return books.stream()
        .map(bookMapper::mapTo)
        .collect(Collectors.toList());
  }

  /**
   * GET /api/books/{isbn}
   */
  @GetMapping("/{isbn}")
  public ResponseEntity<BookDto> getBook(@PathVariable("isbn") String isbn) {
    Optional<BookEntity> foundBook = bookService.findOne(isbn);
    return foundBook.map(bookEntity -> {
      BookDto bookDto = bookMapper.mapTo(bookEntity);
      return new ResponseEntity<>(bookDto, HttpStatus.OK);
    }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  /**
   * PUT /api/books/{isbn}
   */
  @PutMapping("/{isbn}")
  public ResponseEntity<BookDto> createUpdateBook(
      @PathVariable String isbn,
      @Valid @RequestBody BookDto bookDto) {

    BookEntity bookEntity = bookMapper.mapFrom(bookDto);
    bookEntity.setIsbn(isbn); // Ensure path ISBN is used
    boolean bookExists = bookService.isExists(isbn);
    BookEntity savedBookEntity = bookService.createUpdateBook(isbn, bookEntity);
    BookDto savedUpdatedBookDto = bookMapper.mapTo(savedBookEntity);

    return new ResponseEntity<>(
        savedUpdatedBookDto,
        bookExists ? HttpStatus.OK : HttpStatus.CREATED);
  }

  /**
   * PATCH /api/books/{isbn}
   */
  @PatchMapping("/{isbn}")
  public ResponseEntity<BookDto> partialUpdateBook(
      @PathVariable("isbn") String isbn,
      @RequestBody BookDto bookDto) {
    if (!bookService.isExists(isbn)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    BookEntity bookEntity = bookMapper.mapFrom(bookDto);
    // Partial update merges non-null fields. Service handles logic.
    // ensure ISBN helps service identify if partialUpdate(isbn, ...) relies on
    // entity ID.
    // However, partialUpdate typically uses first arg as ID.
    // Safe to set ID on entity anyway.
    bookEntity.setIsbn(isbn);
    BookEntity updatedBookEntity = bookService.partialUpdate(isbn, bookEntity);
    return new ResponseEntity<>(
        bookMapper.mapTo(updatedBookEntity),
        HttpStatus.OK);
  }

  /**
   * DELETE /api/books/{isbn}
   */
  @DeleteMapping("/{isbn}")
  public ResponseEntity<Void> deleteBook(@PathVariable("isbn") String isbn) {
    bookService.delete(isbn);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}