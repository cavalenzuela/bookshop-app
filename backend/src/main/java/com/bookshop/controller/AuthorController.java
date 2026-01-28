package com.bookshop.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.AuthorService;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

  private final AuthorService authorService;
  private final Mapper<AuthorEntity, AuthorDto> authorMapper;

  public AuthorController(AuthorService authorService, Mapper<AuthorEntity, AuthorDto> authorMapper) {
    this.authorService = authorService;
    this.authorMapper = authorMapper;
  }

  /**
   * POST /api/authors
   */
  @PostMapping
  public ResponseEntity<AuthorDto> createAuthor(@Valid @RequestBody AuthorDto author) {
    AuthorEntity authorEntity = authorMapper.mapFrom(author);
    AuthorEntity savedAuthorEntity = authorService.save(authorEntity);
    return new ResponseEntity<>(authorMapper.mapTo(savedAuthorEntity), HttpStatus.CREATED);
  }

  /**
   * GET /api/authors
   */
  @GetMapping
  public List<AuthorDto> listAuthors() {
    List<AuthorEntity> authors = authorService.findAll();
    return authors.stream()
        .map(authorMapper::mapTo)
        .collect(Collectors.toList());
  }

  /**
   * GET /api/authors/{id}
   */
  @GetMapping("/{id}")
  public ResponseEntity<AuthorDto> getAuthor(@PathVariable("id") Long id) {
    Optional<AuthorEntity> foundAuthor = authorService.findOne(id);
    return foundAuthor.map(authorEntity -> {
      AuthorDto authorDto = authorMapper.mapTo(authorEntity);
      return new ResponseEntity<>(authorDto, HttpStatus.OK);
    }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  /**
   * PUT /api/authors/{id}
   */
  @PutMapping("/{id}")
  public ResponseEntity<AuthorDto> fullUpdateAuthor(
      @PathVariable("id") Long id,
      @Valid @RequestBody AuthorDto authorDto) {

    if (!authorService.isExists(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    AuthorEntity authorEntity = authorMapper.mapFrom(authorDto);
    authorEntity.setId(id); // Set ID on the entity, not the record
    AuthorEntity savedAuthorEntity = authorService.save(authorEntity);
    return new ResponseEntity<>(authorMapper.mapTo(savedAuthorEntity), HttpStatus.OK);
  }

  /**
   * PATCH /api/authors/{id}
   */
  @PatchMapping("/{id}")
  public ResponseEntity<AuthorDto> partialUpdate(
      @PathVariable("id") Long id,
      @RequestBody AuthorDto authorDto) {
    if (!authorService.isExists(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    AuthorEntity authorEntity = authorMapper.mapFrom(authorDto);
    // Para partial update, el servicio se encarga de mergear.
    // Pero si authorEntity no tiene ID, el servicio necesita saber cuál actualizar.
    // partialUpdate(id, authorEntity) ya recibe el ID por separado.
    AuthorEntity updatedAuthor = authorService.partialUpdate(id, authorEntity);
    return new ResponseEntity<>(authorMapper.mapTo(updatedAuthor), HttpStatus.OK);
  }

  /**
   * DELETE /api/authors/{id}
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAuthor(@PathVariable("id") Long id) {
    authorService.delete(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}