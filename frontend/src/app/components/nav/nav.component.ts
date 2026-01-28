import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-dark-surface border-b border-dark-border">
      <div class="nav-content">
        <div class="nav-left">
          <a routerLink="/home" class="nav-title">Book Shop</a>
          @if (authService.isLoggedIn()) {
            <div class="nav-links">
              <a routerLink="/books" routerLinkActive="active">Books</a>
              <a routerLink="/authors" routerLinkActive="active">Authors</a>
              <a routerLink="/categories" routerLinkActive="active">Categories</a>
            </div>
          }
        </div>
        @if (authService.isLoggedIn()) {
          <div class="nav-actions">
            <span class="username">{{ authService.getUsername() }}</span>
            <button (click)="logout()">Logout</button>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    nav {
      background-color: #2d2d2d;
      padding: 10px 20px;
      color: white;
      border-bottom: 1px solid #404040;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 30px;
    }
    .nav-title {
      font-size: 1.2em;
      font-weight: bold;
      text-decoration: none;
      color: white;
    }
    .nav-title:hover {
      color: rgba(255,255,255,0.9);
    }
    .nav-links {
      display: flex;
      gap: 20px;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .nav-links a:hover {
      background-color: rgba(255,255,255,0.1);
    }
    .nav-links a.active {
      background-color: rgba(59, 130, 246, 0.3);
      color: #60a5fa;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .username {
      font-weight: 500;
      color: #b3b3b3;
    }
    button {
      padding: 5px 15px;
      border: 1px solid #404040;
      border-radius: 4px;
      background-color: #3a3a3a;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background-color: #404040;
      border-color: #505050;
    }
  `]
})
export class NavComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Cierra la sesión del usuario y redirige al login.
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Incluso si falla la petición, redirige al login
        this.router.navigate(['/login']);
      }
    });
  }
} 