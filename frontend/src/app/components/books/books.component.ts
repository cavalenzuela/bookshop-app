import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-6 text-white">Books Management</h2>

      <!-- Books List -->
      <div class="bg-dark-card rounded-lg shadow-md p-6 border border-dark-border">
        <h3 class="text-xl font-semibold mb-4 text-white">Books List</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-dark-border">
            <thead class="bg-dark-surface">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ISBN</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-dark-card divide-y divide-dark-border">
              <tr *ngFor="let book of books" class="hover:bg-dark-surface transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-white">{{book.isbn}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div *ngIf="!book.editing" class="text-white">{{book.title}}</div>
                  <input *ngIf="book.editing" type="text" [(ngModel)]="book.title" 
                         class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div *ngIf="!book.editing" class="text-white">{{book.author.name}}</div>
                  <select *ngIf="book.editing" [(ngModel)]="book.author" 
                          class="mt-1 block w-full rounded-md border-dark-border bg-dark-surface text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option *ngFor="let author of authors" [ngValue]="author" class="bg-dark-surface text-white">
                      {{author.name}}
                    </option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button *ngIf="!book.editing" (click)="startEditing(book)"
                          class="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  <button *ngIf="book.editing" (click)="updateBook(book)"
                          class="text-green-400 hover:text-green-300 transition-colors">Save</button>
                  <button *ngIf="book.editing" (click)="cancelEditing(book)"
                          class="text-gray-400 hover:text-gray-300 transition-colors">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BooksComponent implements OnInit {
  books: (Book & { editing?: boolean })[] = [];
  authors: Author[] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  /**
   * Inicializa el componente, cargando la lista de libros y autores.
   */
  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  /**
   * Carga la lista de libros desde el servicio.
   */
  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books.map(book => ({ ...book, editing: false }));
    });
  }

  /**
   * Carga la lista de autores desde el servicio.
   */
  loadAuthors(): void {
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
    });
  }

  /**
   * Activa el modo edición para un libro.
   * @param book Libro a editar
   */
  startEditing(book: Book & { editing?: boolean }): void {
    book.editing = true;
  }

  /**
   * Cancela la edición de un libro y recarga la lista.
   * @param book Libro en edición
   */
  cancelEditing(book: Book & { editing?: boolean }): void {
    book.editing = false;
    this.loadBooks();
  }

  /**
   * Actualiza un libro con los datos editados.
   * @param book Libro editado
   */
  updateBook(book: Book & { editing?: boolean }): void {
    const { editing, ...updateData } = book;
    this.bookService.createOrUpdateBook(book.isbn, updateData).subscribe(() => {
      book.editing = false;
      this.loadBooks();
    });
  }
} 