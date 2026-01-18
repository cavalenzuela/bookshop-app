import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = '/api/authors';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Maneja los errores de las peticiones HTTP y retorna un mensaje adecuado.
   * @param error Error recibido
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Crea un nuevo autor.
   * @param author Objeto autor a crear
   * @returns Observable con el autor creado
   */
  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene la lista de todos los autores.
   * @returns Observable con el arreglo de autores
   */
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un autor por su ID.
   * @param id ID del autor
   * @returns Observable con el autor encontrado
   */
  getAuthor(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza completamente un autor.
   * @param id ID del autor
   * @param author Objeto autor actualizado
   * @returns Observable con el autor actualizado
   */
  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza parcialmente un autor.
   * @param id ID del autor
   * @param partialAuthor Objeto parcial con los datos a actualizar
   * @returns Observable con el autor actualizado
   */
  partialUpdateAuthor(id: number, partialAuthor: Partial<Author>): Observable<Author> {
    return this.http.patch<Author>(`${this.apiUrl}/${id}`, partialAuthor, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un autor por su ID.
   * @param id ID del autor
   * @returns Observable vacío cuando se elimina
   */
  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
} 