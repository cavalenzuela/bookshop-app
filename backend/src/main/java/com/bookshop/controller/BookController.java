package com.bookshop.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bookshop.domain.dto.BookDto;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.BookService;

/**
 * Controlador para la gestión de libros.
 * Proporciona endpoints CRUD para la gestión de libros en el sistema.
 */
@RestController
public class BookController {

  private final BookService bookService;
  private final Mapper<BookEntity, BookDto> bookMapper;

  public BookController(Mapper<BookEntity, BookDto> bookMapper, BookService bookService) {
    this.bookMapper = bookMapper;
    this.bookService = bookService;
  }

  /**
   * Crea o actualiza un libro en el sistema.
   * Si el libro no existe, lo crea; si existe, lo actualiza completamente.
   *
   * @param isbn ISBN del libro
   * @param bookDto Datos del libro a crear/actualizar
   * @return ResponseEntity con el libro creado/actualizado y estado CREATED/OK
   */
  @PutMapping(path = "/books/{isbn}")
  public ResponseEntity<BookDto> createUpdateBook(
      @PathVariable String isbn,
      @RequestBody BookDto bookDto) {
    BookEntity bookEntity = bookMapper.mapFrom(bookDto);
    boolean bookExists = bookService.isExists(isbn);
    BookEntity savedBookEntity = bookService.createUpdateBook(isbn, bookEntity);
    BookDto savedUpdatedBookDto = bookMapper.mapTo(savedBookEntity);

    if(bookExists){
      return new ResponseEntity(savedUpdatedBookDto, HttpStatus.OK);
    } else {
      return new ResponseEntity(savedUpdatedBookDto, HttpStatus.CREATED);
    }
  }

  /**
   * Actualiza parcialmente un libro existente.
   * Actualiza solo los campos proporcionados en el DTO.
   *
   * @param isbn ISBN del libro a actualizar
   * @param bookDto Datos parciales del libro
   * @return ResponseEntity con el libro actualizado o NOT_FOUND
   */
  @PatchMapping(path = "/books/{isbn}")
  public ResponseEntity<BookDto> partialUpdateBook(
      @PathVariable("isbn") String isbn,
      @RequestBody BookDto bookDto
  ){
    if(!bookService.isExists(isbn)){
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    BookEntity bookEntity = bookMapper.mapFrom(bookDto);
    BookEntity updatedBookEntity = bookService.partialUpdate(isbn, bookEntity);
    return new ResponseEntity<>(
        bookMapper.mapTo(updatedBookEntity),
        HttpStatus.OK);
  }

  /**
   * Obtiene la lista de todos los libros.
   * Convierte cada entidad a DTO antes de retornarla.
   *
   * @return Lista de DTOs de libros
   */
  @GetMapping(path = "/books")
  public List<BookDto> listBooks() {
    List<BookEntity> books = bookService.findAll();
    return books.stream()
        .map(bookMapper::mapTo)
        .collect(Collectors.toList());
  }

  /**
   * Obtiene un libro específico por su ISBN.
   * Retorna el libro si existe, o NOT_FOUND si no existe.
   *
   * @param isbn ISBN del libro a buscar
   * @return ResponseEntity con el libro encontrado o NOT_FOUND
   */
  @GetMapping(path = "/books/{isbn}")
  public ResponseEntity<BookDto> getBook(@PathVariable("isbn") String isbn) {
    Optional<BookEntity> foundBook = bookService.findOne(isbn);
    return foundBook.map(bookEntity -> {
      BookDto bookDto = bookMapper.mapTo(bookEntity);
      return new ResponseEntity<>(bookDto, HttpStatus.OK);
    }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  /**
   * Elimina un libro del sistema.
   * Retorna NO_CONTENT si la eliminación fue exitosa.
   *
   * @param isbn ISBN del libro a eliminar
   * @return ResponseEntity con estado NO_CONTENT
   */
  @DeleteMapping(path = "/books/{isbn}")
  public ResponseEntity<Void> deleteBook(@PathVariable("isbn") String isbn) {
    bookService.delete(isbn);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}