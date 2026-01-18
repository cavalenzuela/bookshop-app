import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Books List</h2>
        <a routerLink="/books/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Add New Book</a>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
        {{ errorMessage }}
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-300">Loading books...</p>
      </div>

      <!-- Books Table -->
      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="min-w-full bg-dark-card border border-dark-border rounded-lg">
          <thead>
            <tr class="bg-dark-surface">
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Title</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Author Name</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">ISBN</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let book of books" class="hover:bg-dark-surface transition-colors">
              <td class="px-6 py-4 border-b border-dark-border text-white">{{book.title}}</td>
              <td class="px-6 py-4 border-b border-dark-border text-white">{{book.author?.name || 'No author assigned'}}</td>
              <td class="px-6 py-4 border-b border-dark-border text-white">{{book.isbn}}</td>
              <td class="px-6 py-4 border-b border-dark-border">
                <button 
                  [routerLink]="['/books/edit', book.isbn]"
                  class="text-blue-400 hover:text-blue-300 mr-2 transition-colors">
                  Edit
                </button>
                <button 
                  (click)="deleteBook(book.isbn)"
                  class="text-red-400 hover:text-red-300 transition-colors">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="books.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-400">
                No books found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private bookService: BookService) {}

  /**
   * Inicializa el componente y carga la lista de libros.
   */
  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Carga la lista de libros desde el servicio.
   */
  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.bookService.getBooks().subscribe(
      (books) => {
        this.books = books;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading books: ' + error.message;
        this.isLoading = false;
        console.error('Error loading books:', error);
      }
    );
  }

  /**
   * Elimina un libro por su ISBN y actualiza la lista.
   * @param isbn ISBN del libro a eliminar
   */
  deleteBook(isbn: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(isbn).subscribe(
        () => {
          this.books = this.books.filter(book => book.isbn !== isbn);
        },
        (error) => {
          this.errorMessage = 'Error deleting book: ' + error.message;
          console.error('Error deleting book:', error);
        }
      );
    }
  }
}
