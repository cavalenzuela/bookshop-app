import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';
import { BookService } from '../../../services/book.service';
import { AuthorService } from '../../../services/author.service';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
      <h2 class="text-2xl font-bold mb-6 text-white">{{isEditing() ? 'Edit' : 'Add New'}} Book</h2>
      
      <!-- Success Message -->
      @if (successMessage()) {
        <div class="mb-4 p-4 bg-green-900 text-green-200 rounded-lg border border-green-700">
          {{ successMessage() }}
        </div>
      }

      <!-- Error Message -->
      @if (errorMessage()) {
        <div class="mb-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
          {{ errorMessage() }}
        </div>
      }
      
      <!-- Loading Message -->
      @if (isLoading()) {
        <div class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-300">Loading authors and categories...</p>
        </div>
      }

      @if (!isLoading()) {
        <form (ngSubmit)="onSubmit()" #bookForm="ngForm">
          <div class="mb-4">
            <label for="isbn" class="block text-gray-300 font-bold mb-2">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              [(ngModel)]="book.isbn"
              required
              [readonly]="isEditing()"
              class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
              [class.border-red-500]="bookForm.submitted && bookForm.form.get('isbn')?.invalid"
            >
            @if (bookForm.submitted && bookForm.form.get('isbn')?.invalid) {
              <div class="text-red-400 text-sm mt-1">
                ISBN is required
              </div>
            }
          </div>

          <div class="mb-4">
            <label for="title" class="block text-gray-300 font-bold mb-2">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="book.title"
              required
              class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
              [class.border-red-500]="bookForm.submitted && bookForm.form.get('title')?.invalid"
            >
            @if (bookForm.submitted && bookForm.form.get('title')?.invalid) {
              <div class="text-red-400 text-sm mt-1">
                Title is required
              </div>
            }
          </div>

          <div class="mb-6">
            <label for="author" class="block text-gray-300 font-bold mb-2">Author</label>
            <select
              id="author"
              name="author"
              [(ngModel)]="selectedAuthorId"
              required
              class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
              [class.border-red-500]="bookForm.submitted && !selectedAuthorId"
            >
              <option [ngValue]="0" disabled class="bg-dark-surface text-white">Select an author</option>
              @for (author of authors(); track author.id) {
                <option [ngValue]="author.id" class="bg-dark-surface text-white">
                  {{author.name}}
                </option>
              }
            </select>
            @if (bookForm.submitted && !selectedAuthorId) {
              <div class="text-red-400 text-sm mt-1">
                Please select an author
              </div>
            }
          </div>

          <div class="mb-6">
            <label for="category" class="block text-gray-300 font-bold mb-2">Category</label>
            <select
              id="category"
              name="category"
              [(ngModel)]="selectedCategoryId"
              required
              class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
              [class.border-red-500]="bookForm.submitted && !selectedCategoryId"
            >
              <option [ngValue]="0" disabled class="bg-dark-surface text-white">Select a category</option>
              @for (category of categories(); track category.id) {
                <option [ngValue]="category.id" class="bg-dark-surface text-white">
                  {{category.name}}
                </option>
              }
            </select>
            @if (bookForm.submitted && !selectedCategoryId) {
              <div class="text-red-400 text-sm mt-1">
                Please select a category
              </div>
            }
          </div>

          <div class="flex justify-between">
            <button
              type="submit"
              [disabled]="!bookForm.form.valid"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {{isEditing() ? 'Update' : 'Create'}} Book
            </button>
            <button
              type="button"
              routerLink="/books"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class BookFormComponent implements OnInit {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  book: Book = {
    isbn: '',
    title: '',
    author: null as any,
    category: null as any
  };

  selectedAuthorId: number = 0;
  selectedCategoryId: number = 0;

  // Signals
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  isEditing = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(true);


  /**
   * Inicializa el formulario, carga autores y, si corresponde, carga el libro a editar.
   */
  ngOnInit(): void {
    this.loadAuthors();
    this.loadCategories();
    const isbn = this.route.snapshot.paramMap.get('isbn');
    if (isbn) {
      this.isEditing.set(true);
      this.loadBook(isbn);
    }
  }

  /**
   * Carga la lista de autores disponibles desde el servicio.
   */
  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors.set(authors);
        this.checkLoadingComplete();
      },
      error: (error) => {
        this.errorMessage.set('Error loading authors: ' + error.message);
        this.isLoading.set(false);
        console.error('Error loading authors:', error);
      }
    });
  }

  /**
   * Carga la lista de categorías disponibles desde el servicio.
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.checkLoadingComplete();
      },
      error: (error) => {
        this.errorMessage.set('Error loading categories: ' + error.message);
        console.error('Error loading categories:', error);
      }
    });
  }

  private checkLoadingComplete() {
    if (this.authors().length >= 0 && this.categories().length >= 0) {
      // Small optimization: only stop loading if we are NOT editing
      // If editing, we still wait for loadBook
      if (!this.isEditing()) {
        this.isLoading.set(false);
      }
    }
  }

  /**
   * Carga los datos de un libro específico para edición.
   * @param isbn ISBN del libro a cargar
   */
  loadBook(isbn: string): void {
    this.bookService.getBook(isbn).subscribe({
      next: (book) => {
        this.book = book;
        this.selectedAuthorId = book.author?.id || 0;
        this.selectedCategoryId = book.category?.id || 0;
        this.isLoading.set(false); // All data loaded
      },
      error: (error) => {
        this.errorMessage.set('Error loading book: ' + error.message);
        this.isLoading.set(false);
        console.error('Error loading book:', error);
      }
    });
  }

  /**
   * Envía el formulario para crear o actualizar un libro.
   */
  onSubmit(): void {
    console.log('Form submitted. Current book state:', this.book);

    const selectedAuthor = this.authors().find(a => a.id === this.selectedAuthorId);
    const selectedCategory = this.categories().find(c => c.id === this.selectedCategoryId);

    if (!selectedAuthor) {
      this.errorMessage.set('Please select an author');
      console.error('No author selected');
      return;
    }
    if (!selectedCategory) {
      this.errorMessage.set('Please select a category');
      console.error('No category selected');
      return;
    }

    // Create a copy of the book with the complete author and category objects
    const bookToSave = {
      isbn: this.book.isbn.trim(),
      title: this.book.title.trim(),
      author: selectedAuthor,
      category: selectedCategory
    };

    console.log('Book to save:', bookToSave);

    this.errorMessage.set('');
    this.successMessage.set('');

    const action = this.isEditing() ? 'updating' : 'creating';

    this.bookService.createOrUpdateBook(bookToSave.isbn, bookToSave).subscribe({
      next: (response) => {
        console.log(`Book ${action} response:`, response);
        this.successMessage.set(`Book ${this.isEditing() ? 'updated' : 'created'} successfully!`);

        // Delay navigation to ensure the user sees the success message
        setTimeout(() => {
          this.router.navigate(['/books']).then(() => {
            // Force a reload of the books list (handled by the component init)
          });
        }, 1500);
      },
      error: (error) => {
        console.error(`Error ${action} book:`, error);
        if (error.error) {
          this.errorMessage.set(`Error ${action} book: ${error.error.message || error.message}`);
        } else {
          this.errorMessage.set(`Error ${action} book: ${error.message}`);
        }
      }
    });
  }
}
