package com.bookshop.services.impl;

import com.bookshop.domain.entities.BookEntity;
import com.bookshop.repositories.BookRepository;
import com.bookshop.services.BookService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class BookServiceImpl implements BookService {

  private final BookRepository bookRepository;

  public BookServiceImpl(BookRepository bookRepository) {
    this.bookRepository = bookRepository;
  }

  /**
   * Crea o actualiza un libro.
   * @param isbn El ISBN del libro
   * @param book La entidad del libro a crear/actualizar
   * @return El libro creado o actualizado
   */
  @Override
  @CacheEvict(value = "books", allEntries = true)
  public BookEntity createUpdateBook(String isbn, BookEntity book) {
    book.setIsbn(isbn);
    return bookRepository.save(book);
  }

  /**
   * Obtiene una lista de todos los libros.
   * @return Lista de todos los libros existentes
   */
  @Override
  @Cacheable(value = "books")
  public List<BookEntity> findAll() {
    return StreamSupport
        .stream(
            bookRepository.findAll().spliterator(),
            false)
        .collect(Collectors.toList());
  }

  /**
   * Obtiene una página de libros con paginación.
   * @param pageable Objeto que contiene la configuración de paginación
   * @return Página de libros con la configuración especificada
   */
  @Override
  @Cacheable(value = "books", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
  public Page<BookEntity> findAll(Pageable pageable) {
    return bookRepository.findAll(pageable);
  }

  /**
   * Busca un libro por su ISBN.
   * @param isbn El ISBN del libro a buscar
   * @return Optional que contiene el libro encontrado o vacío si no existe
   */
  @Override
  @Cacheable(value = "books", key = "#isbn")
  public Optional<BookEntity> findOne(String isbn) {
    return bookRepository.findById(isbn);
  }

  /**
   * Verifica si existe un libro con el ISBN especificado.
   * @param isbn El ISBN del libro a verificar
   * @return true si existe, false en caso contrario
   */
  @Override
  public boolean isExists(String isbn) {
    return bookRepository.existsById(isbn);
  }

  /**
   * Actualiza parcialmente un libro existente.
   * @param isbn El ISBN del libro a actualizar
   * @param bookEntity Los datos a actualizar del libro
   * @return El libro actualizado
   * @throws RuntimeException Si el libro no existe
   */
  @Override
  @CacheEvict(value = "books", allEntries = true)
  public BookEntity partialUpdate(String isbn, BookEntity bookEntity) {
    bookEntity.setIsbn(isbn);

    return bookRepository.findById(isbn).map(existingBook -> {
      Optional.ofNullable(bookEntity.getTitle()).ifPresent(existingBook::setTitle);
      return bookRepository.save(existingBook);
    }).orElseThrow(() -> new RuntimeException("Book does not exist"));
  }

  /**
   * Elimina un libro por su ISBN.
   * @param isbn El ISBN del libro a eliminar
   */
  @Override
  @CacheEvict(value = "books", allEntries = true)
  public void delete(String isbn) {
    bookRepository.deleteById(isbn);
  }
}

