import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
      <h2 class="text-2xl font-bold mb-6 text-white">{{isEditing ? 'Edit' : 'Add New'}} Category</h2>
      <form (ngSubmit)="onSubmit()" #categoryForm="ngForm">
        <div class="mb-4">
          <label for="name" class="block text-gray-300 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="category.name"
            required
            class="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white rounded-lg focus:outline-none focus:border-blue-500"
            [class.border-red-500]="categoryForm.submitted && categoryForm.form.get('name')?.invalid"
          >
          <div *ngIf="categoryForm.submitted && categoryForm.form.get('name')?.invalid" class="text-red-400 text-sm mt-1">
            Name is required
          </div>
        </div>
        <div class="flex justify-between">
          <button
            type="submit"
            [disabled]="isSubmitting || !categoryForm.form.valid"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <span *ngIf="isSubmitting" class="inline-block mr-2">Saving...</span>
            <span *ngIf="!isSubmitting">{{isEditing ? 'Update' : 'Create'}} Category</span>
          </button>
          <button
            type="button"
            routerLink="/categories"
            [disabled]="isSubmitting"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >Cancel</button>
        </div>
      </form>
      <div *ngIf="successMessage" class="mt-4 p-4 bg-green-900 text-green-200 rounded-lg border border-green-700">{{successMessage}}</div>
      <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">{{errorMessage}}</div>
    </div>
  `,
  styles: []
})
export class CategoryFormComponent implements OnInit {
  category: Category = { name: '' };
  isEditing = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadCategory(+id);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategory(id).subscribe({
      next: (cat) => this.category = cat,
      error: (err) => this.errorMessage = err.message
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.isEditing && this.category.id) {
      this.categoryService.updateCategory(this.category.id, this.category).subscribe({
        next: () => {
          this.successMessage = 'Category updated successfully!';
          setTimeout(() => this.router.navigate(['/categories']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isSubmitting = false;
        }
      });
    } else {
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          this.successMessage = 'Category created successfully!';
          setTimeout(() => this.router.navigate(['/categories']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isSubmitting = false;
        }
      });
    }
  }
} 