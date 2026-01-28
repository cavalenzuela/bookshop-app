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
import static org.mockito.ArgumentMatchers.anyString;
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
import com.bookshop.domain.dto.BookDto;
import com.bookshop.domain.dto.CategoryDto;
import com.bookshop.domain.entities.AuthorEntity;
import com.bookshop.domain.entities.BookEntity;
import com.bookshop.domain.entities.CategoryEntity;
import com.bookshop.mappers.Mapper;
import com.bookshop.services.BookService;

@ExtendWith(MockitoExtension.class)
class BookControllerTest {

    @Mock
    private BookService bookService;

    @Mock
    private Mapper<BookEntity, BookDto> bookMapper;

    @InjectMocks
    private BookController bookController;

    private BookDto bookDto;
    private BookEntity bookEntity;
    private AuthorDto authorDto;
    private AuthorEntity authorEntity;
    private CategoryDto categoryDto;
    private CategoryEntity categoryEntity;

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

        categoryDto = new CategoryDto(
                1L,
                "Test Category");

        categoryEntity = CategoryEntity.builder()
                .id(1L)
                .name("Test Category")
                .build();

        bookDto = new BookDto(
                "1234567890",
                "Test Book",
                authorDto,
                categoryDto);

        bookEntity = BookEntity.builder()
                .isbn("1234567890")
                .title("Test Book")
                .authorEntity(authorEntity)
                .category(categoryEntity)
                .build();
    }

    /**
     * Verifica que el método createUpdateBook cree un nuevo libro cuando no existe.
     * Debe mapear el DTO a Entity, crear el libro y retornar el DTO con estado
     * CREATED.
     */
    @Test
    void createUpdateBook_WhenBookDoesNotExist_ShouldCreateNewBook() {
        when(bookService.isExists(anyString())).thenReturn(false);
        when(bookMapper.mapFrom(any(BookDto.class))).thenReturn(bookEntity);
        when(bookService.createUpdateBook(anyString(), any(BookEntity.class))).thenReturn(bookEntity);
        when(bookMapper.mapTo(any(BookEntity.class))).thenReturn(bookDto);

        ResponseEntity<BookDto> response = bookController.createUpdateBook("1234567890", bookDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(bookDto);
        verify(bookService).createUpdateBook("1234567890", bookEntity);
    }

    /**
     * Verifica que el método createUpdateBook actualice un libro existente.
     * Debe actualizar el libro y retornar el DTO actualizado con estado OK.
     */
    @Test
    void createUpdateBook_WhenBookExists_ShouldUpdateBook() {
        when(bookService.isExists(anyString())).thenReturn(true);
        when(bookMapper.mapFrom(any(BookDto.class))).thenReturn(bookEntity);
        when(bookService.createUpdateBook(anyString(), any(BookEntity.class))).thenReturn(bookEntity);
        when(bookMapper.mapTo(any(BookEntity.class))).thenReturn(bookDto);

        ResponseEntity<BookDto> response = bookController.createUpdateBook("1234567890", bookDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(bookDto);
        verify(bookService).createUpdateBook("1234567890", bookEntity);
    }

    /**
     * Verifica que el método partialUpdateBook actualice parcialmente un libro
     * existente.
     * Solo actualiza los campos proporcionados en el DTO y retorna el libro
     * actualizado.
     */
    @Test
    void partialUpdateBook_WhenBookExists_ShouldUpdateBook() {
        when(bookService.isExists(anyString())).thenReturn(true);
        when(bookMapper.mapFrom(any(BookDto.class))).thenReturn(bookEntity);
        when(bookService.partialUpdate(anyString(), any(BookEntity.class))).thenReturn(bookEntity);
        when(bookMapper.mapTo(any(BookEntity.class))).thenReturn(bookDto);

        ResponseEntity<BookDto> response = bookController.partialUpdateBook("1234567890", bookDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(bookDto);
        verify(bookService).partialUpdate("1234567890", bookEntity);
    }

    /**
     * Verifica que el método partialUpdateBook retorne NOT_FOUND cuando el libro no
     * existe.
     * No debe intentar actualizar un libro inexistente.
     */
    @Test
    void partialUpdateBook_WhenBookDoesNotExist_ShouldReturnNotFound() {
        when(bookService.isExists(anyString())).thenReturn(false);

        ResponseEntity<BookDto> response = bookController.partialUpdateBook("1234567890", bookDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(bookService, never()).partialUpdate(anyString(), any(BookEntity.class));
    }

    /**
     * Verifica que el método listBooks retorne correctamente la lista de todos los
     * libros.
     * Debe mapear todas las entidades a DTOs antes de retornar la lista.
     */
    @Test
    void listBooks_ShouldReturnAllBooks() {
        List<BookEntity> bookEntities = Arrays.asList(bookEntity);
        List<BookDto> bookDtos = Arrays.asList(bookDto);

        when(bookService.findAll()).thenReturn(bookEntities);
        when(bookMapper.mapTo(any(BookEntity.class))).thenReturn(bookDto);

        List<BookDto> response = bookController.listBooks();

        assertThat(response).isEqualTo(bookDtos);
        verify(bookService).findAll();
    }

    /**
     * Verifica que el método getBook retorne correctamente un libro existente.
     * Debe mapear la entidad a DTO antes de retornarla.
     */
    @Test
    void getBook_WhenBookExists_ShouldReturnBook() {
        when(bookService.findOne(anyString())).thenReturn(Optional.of(bookEntity));
        when(bookMapper.mapTo(any(BookEntity.class))).thenReturn(bookDto);

        ResponseEntity<BookDto> response = bookController.getBook("1234567890");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(bookDto);
        verify(bookService).findOne("1234567890");
    }

    /**
     * Verifica que el método getBook retorne NOT_FOUND cuando el libro no existe.
     * Debe retornar un estado 404 cuando no se encuentra el libro solicitado.
     */
    @Test
    void getBook_WhenBookDoesNotExist_ShouldReturnNotFound() {
        when(bookService.findOne(anyString())).thenReturn(Optional.empty());

        ResponseEntity<BookDto> response = bookController.getBook("1234567890");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(bookService).findOne("1234567890");
    }

    /**
     * Verifica que el método deleteBook elimine correctamente un libro existente.
     * Debe retornar NO_CONTENT (204) al eliminar el libro.
     */
    @Test
    void deleteBook_ShouldDeleteBook() {
        doNothing().when(bookService).delete(anyString());

        ResponseEntity response = bookController.deleteBook("1234567890");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(bookService).delete("1234567890");
    }
}