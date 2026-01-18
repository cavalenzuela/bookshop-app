import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Author } from '../../../models/author.model';
import { AuthorService } from '../../../services/author.service';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Authors List</h2>
        <a routerLink="/authors/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Add New Author</a>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
        {{ errorMessage }}
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-300">Loading authors...</p>
      </div>

      <!-- Authors Table -->
      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="min-w-full bg-dark-card border border-dark-border rounded-lg">
          <thead>
            <tr class="bg-dark-surface">
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Name</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Birth Date</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Nationality</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let author of authors" class="hover:bg-dark-surface transition-colors">
              <td class="px-6 py-4 border-b border-dark-border text-white">{{author.name}}</td>
              <td class="px-6 py-4 border-b border-dark-border text-white">{{author.birthDate | date:'yyyy-MM-dd'}}</td>
              <td class="px-6 py-4 border-b border-dark-border text-white">{{author.nationality}}</td>
              <td class="px-6 py-4 border-b border-dark-border">
                <button 
                  [routerLink]="['/authors/edit', author.id]"
                  class="text-blue-400 hover:text-blue-300 mr-2 transition-colors">
                  Edit
                </button>
                <button 
                  (click)="deleteAuthor(author.id!)"
                  class="text-red-400 hover:text-red-300 transition-colors">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="authors.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-400">
                No authors found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private authorService: AuthorService) {}

  /**
   * Inicializa el componente y carga la lista de autores.
   */
  ngOnInit(): void {
    this.loadAuthors();
  }

  /**
   * Carga la lista de autores desde el servicio.
   */
  loadAuthors(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authorService.getAuthors().subscribe(
      (authors) => {
        this.authors = authors;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading authors: ' + error.message;
        this.isLoading = false;
        console.error('Error loading authors:', error);
      }
    );
  }

  /**
   * Elimina un autor por su ID y actualiza la lista.
   * @param id ID del autor a eliminar
   */
  deleteAuthor(id: number): void {
    if (confirm('Are you sure you want to delete this author?')) {
      this.authorService.deleteAuthor(id).subscribe(
        () => {
          this.authors = this.authors.filter(author => author.id !== id);
        },
        (error) => {
          this.errorMessage = 'Error deleting author: ' + error.message;
          console.error('Error deleting author:', error);
        }
      );
    }
  }
}
