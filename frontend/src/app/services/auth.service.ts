import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario con nombre de usuario y contraseña.
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del registro
   */
  register(username: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, { username, password }, { responseType: 'text' });
  }

  /**
   * Inicia sesión con nombre de usuario y contraseña.
   * Guarda el token y el nombre de usuario en localStorage.
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del login
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          this.tokenSubject.next(response.token);
          this.usernameSubject.next(response.username);
        })
      );
  }

  /**
   * Cierra la sesión del usuario actual y elimina los datos del localStorage.
   * @returns Observable con la respuesta del logout
   */
  logout(): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers, responseType: 'text' })
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.tokenSubject.next(null);
          this.usernameSubject.next(null);
        })
      );
  }

  /**
   * Obtiene el token actual almacenado.
   * @returns Token o null si no existe
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns true si hay token, false en caso contrario
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el nombre de usuario actual almacenado.
   * @returns Nombre de usuario o null si no existe
   */
  getUsername(): string | null {
    return this.usernameSubject.value;
  }
} 