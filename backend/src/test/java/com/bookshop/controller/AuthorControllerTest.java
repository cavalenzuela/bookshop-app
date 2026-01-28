package com.bookshop.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bookshop.domain.dto.AuthorDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.AuthorService;

@ExtendWith(MockitoExtension.class)
class AuthorControllerTest {

    @Mock
    private AuthorService authorService;

    @Mock
    private Mapper<AuthorEntity, AuthorDto> authorMapper;

    @InjectMocks
    private AuthorController authorController;

    private AuthorDto authorDto;
    private AuthorEntity authorEntity;

    @BeforeEach
    void setUp() {
        authorDto = new AuthorDto(
                1L,
                "Test Author",
                new Date(),
                "Test Nationality",
                "Test Biography");

        authorEntity = AuthorEntity.builder()
                .id(1L)
                .name("Test Author")
                .birthDate(new Date())
                .nationality("Test Nationality")
                .biography("Test Biography")
                .build();
    }

    /**
     * Verifica que el método createAuthor funcione correctamente al crear un nuevo
     * autor.
     * Debe mapear el DTO a Entity, guardar el autor y retornar el DTO con estado
     * CREATED.
     */
    @Test
    void createAuthor_ShouldCreateNewAuthor() {
        when(authorMapper.mapFrom(any(AuthorDto.class))).thenReturn(authorEntity);
        when(authorService.save(any(AuthorEntity.class))).thenReturn(authorEntity);
        when(authorMapper.mapTo(any(AuthorEntity.class))).thenReturn(authorDto);

        ResponseEntity<AuthorDto> response = authorController.createAuthor(authorDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(authorDto);
        verify(authorService).save(authorEntity);
    }

    /**
     * Verifica que el método fullUpdateAuthor actualice completamente un autor
     * existente.
     * Debe actualizar todos los campos del autor y retornar el DTO actualizado con
     * estado OK.
     */
    @Test
    void fullUpdateAuthor_WhenAuthorExists_ShouldUpdateAuthor() {
        when(authorService.isExists(anyLong())).thenReturn(true);
        when(authorMapper.mapFrom(any(AuthorDto.class))).thenReturn(authorEntity);
        when(authorService.save(any(AuthorEntity.class))).thenReturn(authorEntity);
        when(authorMapper.mapTo(any(AuthorEntity.class))).thenReturn(authorDto);

        ResponseEntity<AuthorDto> response = authorController.fullUpdateAuthor(1L, authorDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authorDto);
        verify(authorService).save(authorEntity);
    }

    /**
     * Verifica que el método fullUpdateAuthor retorne NOT_FOUND cuando el autor no
     * existe.
     * No debe intentar actualizar un autor que no existe en la base de datos.
     */
    @Test
    void fullUpdateAuthor_WhenAuthorDoesNotExist_ShouldReturnNotFound() {
        when(authorService.isExists(anyLong())).thenReturn(false);

        ResponseEntity<AuthorDto> response = authorController.fullUpdateAuthor(1L, authorDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(authorService, never()).save(any(AuthorEntity.class));
    }

    /**
     * Verifica que el método partialUpdate actualice parcialmente un autor
     * existente.
     * Solo actualiza los campos proporcionados en el DTO y retorna el autor
     * actualizado.
     */
    @Test
    void partialUpdate_WhenAuthorExists_ShouldUpdateAuthor() {
        when(authorService.isExists(anyLong())).thenReturn(true);
        when(authorMapper.mapFrom(any(AuthorDto.class))).thenReturn(authorEntity);
        when(authorService.partialUpdate(anyLong(), any(AuthorEntity.class))).thenReturn(authorEntity);
        when(authorMapper.mapTo(any(AuthorEntity.class))).thenReturn(authorDto);

        ResponseEntity<AuthorDto> response = authorController.partialUpdate(1L, authorDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authorDto);
        verify(authorService).partialUpdate(1L, authorEntity);
    }

    /**
     * Verifica que el método partialUpdate retorne NOT_FOUND cuando el autor no
     * existe.
     * No debe intentar actualizar un autor inexistente.
     */
    @Test
    void partialUpdate_WhenAuthorDoesNotExist_ShouldReturnNotFound() {
        when(authorService.isExists(anyLong())).thenReturn(false);

        ResponseEntity<AuthorDto> response = authorController.partialUpdate(1L, authorDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(authorService, never()).partialUpdate(anyLong(), any(AuthorEntity.class));
    }

    /**
     * Verifica que el método listAuthors retorne correctamente la lista de todos
     * los autores.
     * Debe mapear todas las entidades a DTOs antes de retornar la lista.
     */
    @Test
    void listAuthors_ShouldReturnAllAuthors() {
        List<AuthorEntity> authorEntities = Arrays.asList(authorEntity);
        List<AuthorDto> authorDtos = Arrays.asList(authorDto);

        when(authorService.findAll()).thenReturn(authorEntities);
        when(authorMapper.mapTo(any(AuthorEntity.class))).thenReturn(authorDto);

        List<AuthorDto> response = authorController.listAuthors();

        assertThat(response).isEqualTo(authorDtos);
        verify(authorService).findAll();
    }

    /**
     * Verifica que el método getAuthor retorne correctamente un autor existente.
     * Debe mapear la entidad a DTO antes de retornarla.
     */
    @Test
    void getAuthor_WhenAuthorExists_ShouldReturnAuthor() {
        when(authorService.findOne(anyLong())).thenReturn(Optional.of(authorEntity));
        when(authorMapper.mapTo(any(AuthorEntity.class))).thenReturn(authorDto);

        ResponseEntity<AuthorDto> response = authorController.getAuthor(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authorDto);
        verify(authorService).findOne(1L);
    }

    /**
     * Verifica que el método getAuthor retorne NOT_FOUND cuando el autor no existe.
     * Debe retornar un estado 404 cuando no se encuentra el autor solicitado.
     */
    @Test
    void getAuthor_WhenAuthorDoesNotExist_ShouldReturnNotFound() {
        when(authorService.findOne(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<AuthorDto> response = authorController.getAuthor(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(authorService).findOne(1L);
    }

    /**
     * Verifica que el método deleteAuthor elimine correctamente un autor existente.
     * Debe retornar NO_CONTENT (204) al eliminar el autor.
     */
    @Test
    void deleteAuthor_ShouldDeleteAuthor() {
        doNothing().when(authorService).delete(anyLong());

        ResponseEntity response = authorController.deleteAuthor(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(authorService).delete(1L);
    }
}