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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.AuthorService;

/**
 * Controlador para la gestión de autores.
 * Proporciona endpoints CRUD para la gestión de autores en el sistema.
 */
@RestController
public class AuthorController {

  private final AuthorService authorService;
  private final Mapper<AuthorEntity, AuthorDto> authorMapper;

  public AuthorController(AuthorService authorService, Mapper<AuthorEntity, AuthorDto> authorMapper) {
    this.authorService = authorService;
    this.authorMapper = authorMapper;
  }

  /**
   * Crea un nuevo autor en el sistema.
   * Convierte el DTO a entidad, guarda el autor y retorna el DTO creado.
   *
   * @param author Datos del autor a crear
   * @return ResponseEntity con el autor creado y estado CREATED
   */
  @PostMapping(path = "/authors")
  public ResponseEntity<AuthorDto> createAuthor(@RequestBody AuthorDto author) {
    AuthorEntity authorEntity = authorMapper.mapFrom(author);
    AuthorEntity savedAuthorEntity = authorService.save(authorEntity);
    return new ResponseEntity<>(authorMapper.mapTo(savedAuthorEntity), HttpStatus.CREATED);
  }

  /**
   * Obtiene la lista de todos los autores.
   * Convierte cada entidad a DTO antes de retornarla.
   *
   * @return Lista de DTOs de autores
   */
  @GetMapping(path = "/authors")
  public List<AuthorDto> listAuthors() {
    List<AuthorEntity> authors = authorService.findAll();
    return authors.stream()
        .map(authorMapper::mapTo)
        .collect(Collectors.toList());
  }

  /**
   * Obtiene un autor específico por su ID.
   * Retorna el autor si existe, o NOT_FOUND si no existe.
   *
   * @param id ID del autor a buscar
   * @return ResponseEntity con el autor encontrado o NOT_FOUND
   */
  @GetMapping(path = "/authors/{id}")
  public ResponseEntity<AuthorDto> getAuthor(@PathVariable("id") Long id) {
    Optional<AuthorEntity> foundAuthor = authorService.findOne(id);
    return foundAuthor.map(authorEntity -> {
      AuthorDto authorDto = authorMapper.mapTo(authorEntity);
      return new ResponseEntity<>(authorDto, HttpStatus.OK);
    }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  /**
   * Actualiza completamente un autor existente.
   * Reemplaza todos los campos del autor con los nuevos datos.
   *
   * @param id ID del autor a actualizar
   * @param authorDto Nuevos datos del autor
   * @return ResponseEntity con el autor actualizado o NOT_FOUND
   */
  @PutMapping(path = "/authors/{id}")
  public ResponseEntity<AuthorDto> fullUpdateAuthor(
      @PathVariable("id") Long id,
      @RequestBody AuthorDto authorDto) {

    if(!authorService.isExists(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    authorDto.setId(id);
    AuthorEntity authorEntity = authorMapper.mapFrom(authorDto);
    AuthorEntity savedAuthorEntity = authorService.save(authorEntity);
    return new ResponseEntity<>(
        authorMapper.mapTo(savedAuthorEntity),
        HttpStatus.OK);
  }

  /**
   * Actualiza parcialmente un autor existente.
   * Actualiza solo los campos proporcionados en el DTO.
   *
   * @param id ID del autor a actualizar
   * @param authorDto Datos parciales del autor
   * @return ResponseEntity con el autor actualizado o NOT_FOUND
   */
  @PatchMapping(path = "/authors/{id}")
  public ResponseEntity<AuthorDto> partialUpdate(
      @PathVariable("id") Long id,
      @RequestBody AuthorDto authorDto
  ) {
    if(!authorService.isExists(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    AuthorEntity authorEntity = authorMapper.mapFrom(authorDto);
    AuthorEntity updatedAuthor = authorService.partialUpdate(id, authorEntity);
    return new ResponseEntity<>(
        authorMapper.mapTo(updatedAuthor),
        HttpStatus.OK);
  }

  /**
   * Elimina un autor del sistema.
   * Retorna NO_CONTENT si la eliminación fue exitosa.
   *
   * @param id ID del autor a eliminar
   * @return ResponseEntity con estado NO_CONTENT
   */
  @DeleteMapping(path = "/authors/{id}")
  public ResponseEntity deleteAuthor(@PathVariable("id") Long id) {
    authorService.delete(id);
    return new ResponseEntity(HttpStatus.NO_CONTENT);
  }
}
