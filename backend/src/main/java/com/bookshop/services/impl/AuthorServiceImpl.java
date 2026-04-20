package com.bookshop.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.repositories.AuthorRepository;
import com.bookshop.services.AuthorService;

@Service
public class AuthorServiceImpl implements AuthorService {

  private final AuthorRepository authorRepository;

  public AuthorServiceImpl(AuthorRepository authorRepository) {
    this.authorRepository = authorRepository;
  }

  /**
   * Guarda un nuevo autor en la base de datos.
   * @param authorEntity El objeto del autor a guardar
   * @return El autor guardado con su ID asignado
   */
  @Override
  @CacheEvict(value = "authors", allEntries = true)
  public AuthorEntity save(AuthorEntity authorEntity) {
    return authorRepository.save(authorEntity);
  }

  /**
   * Obtiene una lista de todos los autores.
   * @return Lista de todos los autores existentes
   */
  @Override
  @Cacheable(value = "authors")
  public List<AuthorEntity> findAll() {
    return StreamSupport.stream(authorRepository
                .findAll()
                .spliterator(),
            false)
        .collect(Collectors.toList());
  }

  /**
   * Busca un autor por su ID.
   * @param id El ID del autor a buscar
   * @return Optional que contiene el autor encontrado o vacío si no existe
   */
  @Override
  @Cacheable(value = "authors", key = "#id")
  public Optional<AuthorEntity> findOne(Long id) {
    return authorRepository.findById(id);
  }

  /**
   * Verifica si existe un autor con el ID especificado.
   * @param id El ID del autor a verificar
   * @return true si existe, false en caso contrario
   */
  @Override
  public boolean isExists(Long id) {
    return authorRepository.existsById(id);
  }

  /**
   * Actualiza parcialmente un autor existente.
   * @param id El ID del autor a actualizar
   * @param authorEntity Los datos a actualizar del autor
   * @return El autor actualizado
   * @throws RuntimeException Si el autor no existe
   */
  @Override
  @CacheEvict(value = "authors", allEntries = true)
  public AuthorEntity partialUpdate(Long id, AuthorEntity authorEntity) {
    authorEntity.setId(id);

    return authorRepository.findById(id).map(existingAuthor -> {
      Optional.ofNullable(authorEntity.getName()).ifPresent(existingAuthor::setName);
      Optional.ofNullable(authorEntity.getBirthDate()).ifPresent(existingAuthor::setBirthDate);
      Optional.ofNullable(authorEntity.getNationality()).ifPresent(existingAuthor::setNationality);
      Optional.ofNullable(authorEntity.getBiography()).ifPresent(existingAuthor::setBiography);
      return authorRepository.save(existingAuthor);
    }).orElseThrow(() -> new RuntimeException("Author does not exist"));
  }

  /**
   * Elimina un autor por su ID.
   * @param id El ID del autor a eliminar
   */
  @Override
  @CacheEvict(value = "authors", allEntries = true)
  public void delete(Long id) {
    authorRepository.deleteById(id);
  }
}
