import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { Author } from '../models/author.model';
import { AuthorService } from './author.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '/api/books';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authorService: AuthorService
  ) { }

  /**
   * Obtiene la lista de todos los libros.
   * @returns Observable con el arreglo de libros
   */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error loading books:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un libro por su ISBN.
   * @param isbn ISBN del libro
   * @returns Observable con el libro encontrado
   */
  getBook(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${isbn}`, this.httpOptions);
  }

  /**
   * Crea o actualiza un libro.
   * @param isbn ISBN del libro
   * @param book Objeto libro a guardar
   * @returns Observable con el libro guardado
   */
  createOrUpdateBook(isbn: string, book: Book): Observable<Book> {
    console.log('Creating/Updating book with data:', book);

    // Validate author
    if (!book.author || !book.author.id) {
      console.error('Invalid author:', book.author);
      throw new Error('Valid Author is required');
    }
    // Validate category
    if (!book.category || !book.category.id) {
      console.error('Invalid category:', book.category);
      throw new Error('Valid Category is required');
    }

    // Create the book object in the format expected by the backend
    const bookToSend = {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      category: book.category
    };
    
    // Log the exact request that will be sent
    console.log('Request URL:', `${this.apiUrl}/${isbn}`);
    console.log('Request headers:', this.httpOptions.headers.keys());
    console.log('Request body:', bookToSend);
    
    return this.http.put<Book>(
      `${this.apiUrl}/${isbn}`, 
      bookToSend,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        observe: 'response'
      }
    ).pipe(
      map(response => {
        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers.keys());
        console.log('API Response body:', response.body);
        
        if (response.body) {
          console.log('Response book details:', {
            isbn: response.body.isbn,
            title: response.body.title,
            author: response.body.author
          });
        }
        
        return response.body as Book;
      }),
      catchError(error => {
        console.error('API Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          headers: error.headers
        });
        throw error;
      })
    );
  }

  /**
   * Actualiza parcialmente un libro.
   * @param isbn ISBN del libro
   * @param partialBook Objeto parcial con los datos a actualizar
   * @returns Observable con el libro actualizado
   */
  partialUpdateBook(isbn: string, partialBook: Partial<Book>): Observable<Book> {
    return this.http.patch<Book>(`${this.apiUrl}/${isbn}`, partialBook, this.httpOptions);
  }

  /**
   * Elimina un libro por su ISBN.
   * @param isbn ISBN del libro
   * @returns Observable vacío cuando se elimina
   */
  deleteBook(isbn: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${isbn}`, this.httpOptions);
  }
}