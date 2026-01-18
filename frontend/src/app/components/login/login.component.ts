import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>{{ isRegistering ? 'Create Account' : 'Login' }}</h2>
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" [(ngModel)]="username" name="username">
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" [(ngModel)]="password" name="password">
      </div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
      <div class="buttons">
        <button (click)="onSubmit()">{{ isRegistering ? 'Crear Usuario' : 'Login' }}</button>
        <button (click)="toggleMode()">{{ isRegistering ? 'Volver al Login' : 'Crear Usuario' }}</button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border-radius: 12px;
      background-color: #2d2d2d;
      border: 1px solid #404040;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    h2 {
      text-align: center;
      color: white;
      margin-bottom: 30px;
      font-size: 1.8rem;
      font-weight: 600;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #b3b3b3;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #404040;
      border-radius: 6px;
      background-color: #3a3a3a;
      color: white;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    .form-group input:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }
    .form-group input::placeholder {
      color: #666;
    }
    .buttons {
      display: flex;
      gap: 12px;
      margin-top: 30px;
    }
    button {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      background-color: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #2563eb;
    }
    button:last-child {
      background-color: #404040;
    }
    button:last-child:hover {
      background-color: #505050;
    }
    .error-message {
      color: #ef4444;
      margin-top: 15px;
      padding: 10px;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 6px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isRegistering = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Cambia entre el modo login y registro.
   */
  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.error = '';
  }

  /**
   * Envía el formulario para iniciar sesión o registrar un usuario.
   */
  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    if (this.isRegistering) {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.error = '';
          this.isRegistering = false;
        },
        error: (error) => {
          this.error = error.error || 'Error al crear usuario';
        }
      });
    } else {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.error = '';
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.error = error.error || 'Error al iniciar sesión';
        }
      });
    }
  }
} 