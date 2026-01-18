import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-6 text-white">Authors Management</h2>
      
      <!-- Add Author Form -->
      <div class="bg-dark-card rounded-lg shadow-md p-6 mb-6 border border-dark-border">
        <h3 class="text-xl font-semibold mb-4 text-white">Add New Author</h3>
        <form (ngSubmit)="createAuthor()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" [(ngModel)]="newAuthor.name" name="name" 
                   class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Birth Date</label>
            <input type="date" [(ngModel)]="newAuthor.birthDate" name="birthDate" 
                   class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Nationality</label>
            <input type="text" [(ngModel)]="newAuthor.nationality" name="nationality" 
                   class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">Biography</label>
            <textarea [(ngModel)]="newAuthor.biography" name="biography" rows="3"
                      class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>
          <button type="submit" 
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            Add Author
          </button>
        </form>
      </div>

      <!-- Authors List -->
      <div class="bg-dark-card rounded-lg shadow-md p-6 border border-dark-border">
        <h3 class="text-xl font-semibold mb-4 text-white">Authors List</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-dark-border">
            <thead class="bg-dark-surface">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Birth Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nationality</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-dark-card divide-y divide-dark-border">
              <tr *ngFor="let author of authors" class="hover:bg-dark-surface transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div *ngIf="!author.editing" class="text-white">{{author.name}}</div>
                  <input *ngIf="author.editing" type="text" [(ngModel)]="author.name" 
                         class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div *ngIf="!author.editing" class="text-white">{{author.birthDate | date:'yyyy-MM-dd'}}</div>
                  <input *ngIf="author.editing" type="date" [(ngModel)]="author.birthDate" 
                         class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div *ngIf="!author.editing" class="text-white">{{author.nationality}}</div>
                  <input *ngIf="author.editing" type="text" [(ngModel)]="author.nationality" 
                         class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button *ngIf="!author.editing" (click)="startEditing(author)"
                          class="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  <button *ngIf="author.editing" (click)="updateAuthor(author)"
                          class="text-green-400 hover:text-green-300 transition-colors">Save</button>
                  <button *ngIf="author.editing" (click)="cancelEditing(author)"
                          class="text-gray-400 hover:text-gray-300 transition-colors">Cancel</button>
                  <button (click)="deleteAuthor(author.id!)"
                          class="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AuthorsComponent implements OnInit {
  authors: (Author & { editing?: boolean })[] = [];
  newAuthor: Author = { name: '', birthDate: '', nationality: '', biography: '' };

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
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors.map(author => ({ ...author, editing: false }));
    });
  }

  /**
   * Crea un nuevo autor usando el formulario.
   */
  createAuthor(): void {
    if (this.newAuthor.name && this.newAuthor.birthDate && this.newAuthor.nationality && this.newAuthor.biography) {
      this.authorService.createAuthor(this.newAuthor).subscribe(() => {
        this.loadAuthors();
        this.newAuthor = { name: '', birthDate: '', nationality: '', biography: '' };
      });
    }
  }

  /**
   * Activa el modo edición para un autor.
   * @param author Autor a editar
   */
  startEditing(author: Author & { editing?: boolean }): void {
    author.editing = true;
  }

  /**
   * Cancela la edición de un autor y recarga la lista.
   * @param author Autor en edición
   */
  cancelEditing(author: Author & { editing?: boolean }): void {
    author.editing = false;
    this.loadAuthors();
  }

  /**
   * Actualiza un autor con los datos editados.
   * @param author Autor editado
   */
  updateAuthor(author: Author & { editing?: boolean }): void {
    if (author.id) {
      const { editing, ...updateData } = author;
      this.authorService.updateAuthor(author.id, updateData).subscribe(() => {
        author.editing = false;
        this.loadAuthors();
      });
    }
  }

  /**
   * Elimina un autor por su ID y actualiza la lista.
   * @param id ID del autor a eliminar
   */
  deleteAuthor(id: number): void {
    if (confirm('Are you sure you want to delete this author?')) {
      this.authorService.deleteAuthor(id).subscribe(() => {
        this.loadAuthors();
      });
    }
  }
} 