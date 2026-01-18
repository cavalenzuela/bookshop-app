import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente de inicio que muestra la bienvenida y enlaces a libros y autores.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Welcome to Book Shop</h1>
        <p class="text-xl text-gray-300 mb-8">Manage your books and authors with ease</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="bg-dark-card rounded-lg shadow-lg p-6 border border-dark-border">
            <h2 class="text-2xl font-semibold text-white mb-4">Books</h2>
            <p class="text-gray-300 mb-4">Manage your book collection, add new books, and assign authors.</p>
            <a routerLink="/books" 
               class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Books
            </a>
          </div>
          <div class="bg-dark-card rounded-lg shadow-lg p-6 border border-dark-border">
            <h2 class="text-2xl font-semibold text-white mb-4">Authors</h2>
            <p class="text-gray-300 mb-4">Manage your authors, add new ones, and view their books.</p>
            <a routerLink="/authors" 
               class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Authors
            </a>
          </div>
          <div class="bg-dark-card rounded-lg shadow-lg p-6 border border-dark-border">
            <h2 class="text-2xl font-semibold text-white mb-4">Categories</h2>
            <p class="text-gray-300 mb-4">Manage your book categories, add new ones, and edit or delete them.</p>
            <a routerLink="/categories" 
               class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              View Categories
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {} 