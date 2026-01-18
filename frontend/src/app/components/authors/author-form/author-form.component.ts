import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Author } from '../../../models/author.model';
import { AuthorService } from '../../../services/author.service';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
      <h2 class="text-2xl font-bold mb-6 text-white">{{isEditing ? 'Edit' : 'Add New'}} Author</h2>
      
      <!-- Success Message -->
      <div *ngIf="successMessage" class="mb-4 p-4 bg-green-900 text-green-200 rounded-lg border border-green-700">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
        {{ errorMessage }}
      </div>
      
      <form (ngSubmit)="onSubmit()" #authorForm="ngForm">
        <div class="mb-4">
          <label for="name" class="block text-gray-300 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="author.name"
            required
            class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
            [class.border-red-500]="authorForm.submitted && authorForm.form.get('name')?.invalid"
          >
          <div *ngIf="authorForm.submitted && authorForm.form.get('name')?.invalid" class="text-red-400 text-sm mt-1">
            Name is required
          </div>
        </div>

        <div class="mb-4">
          <label for="birthDate" class="block text-gray-300 font-bold mb-2">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            [(ngModel)]="author.birthDate"
            required
            class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
            [class.border-red-500]="authorForm.submitted && authorForm.form.get('birthDate')?.invalid"
          >
          <div *ngIf="authorForm.submitted && authorForm.form.get('birthDate')?.invalid" class="text-red-400 text-sm mt-1">
            Birth date is required
          </div>
        </div>

        <div class="mb-4">
          <label for="nationality" class="block text-gray-300 font-bold mb-2">Nationality</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            [(ngModel)]="author.nationality"
            required
            class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
            [class.border-red-500]="authorForm.submitted && authorForm.form.get('nationality')?.invalid"
          >
          <div *ngIf="authorForm.submitted && authorForm.form.get('nationality')?.invalid" class="text-red-400 text-sm mt-1">
            Nationality is required
          </div>
        </div>

        <div class="mb-6">
          <label for="biography" class="block text-gray-300 font-bold mb-2">Biography</label>
          <textarea
            id="biography"
            name="biography"
            [(ngModel)]="author.biography"
            required
            rows="4"
            class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
            [class.border-red-500]="authorForm.submitted && authorForm.form.get('biography')?.invalid"
          ></textarea>
          <div *ngIf="authorForm.submitted && authorForm.form.get('biography')?.invalid" class="text-red-400 text-sm mt-1">
            Biography is required
          </div>
        </div>

        <div class="flex justify-between">
          <button
            type="submit"
            [disabled]="isSubmitting || !authorForm.form.valid"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <span *ngIf="isSubmitting" class="inline-block mr-2">
              Saving...
            </span>
            <span *ngIf="!isSubmitting">
              {{isEditing ? 'Update' : 'Create'}} Author
            </span>
          </button>
          <button
            type="button"
            routerLink="/authors"
            [disabled]="isSubmitting"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class AuthorFormComponent implements OnInit {
  author: Author = {
    name: '',
    birthDate: '',
    nationality: '',
    biography: ''
  };
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Inicializa el formulario, carga el autor si se está editando.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadAuthor(+id);
    }
  }

  /**
   * Carga los datos de un autor específico para edición.
   * @param id ID del autor a cargar
   */
  loadAuthor(id: number): void {
    this.authorService.getAuthor(id).subscribe(
      (author) => {
        // Formatear birthDate a yyyy-MM-dd si existe
        if (author.birthDate) {
          const date = new Date(author.birthDate);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          author.birthDate = `${yyyy}-${mm}-${dd}`;
        }
        this.author = author;
      },
      (error) => {
        this.errorMessage = 'Error loading author: ' + error.message;
        console.error('Error loading author:', error);
      }
    );
  }

  /**
   * Envía el formulario para crear o actualizar un autor.
   */
  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing && this.author.id) {
      this.authorService.updateAuthor(this.author.id, this.author).subscribe(
        (response) => {
          this.successMessage = 'Author updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/authors']);
          }, 1500);
        },
        (error) => {
          this.errorMessage = 'Error updating author: ' + error.message;
          this.isSubmitting = false;
          console.error('Error updating author:', error);
        }
      );
    } else {
      this.authorService.createAuthor(this.author).subscribe(
        (response) => {
          this.successMessage = 'Author created successfully!';
          setTimeout(() => {
            this.router.navigate(['/authors']);
          }, 1500);
        },
        (error) => {
          this.errorMessage = 'Error creating author: ' + error.message;
          this.isSubmitting = false;
          console.error('Error creating author:', error);
        }
      );
    }
  }
}
