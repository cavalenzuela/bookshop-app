import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Categories List</h2>
        <a routerLink="/categories/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Add New Category</a>
      </div>
      <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
        {{errorMessage}}
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-dark-card border border-dark-border rounded-lg">
          <thead>
            <tr class="bg-dark-surface">
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">ID</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Name</th>
              <th class="px-6 py-3 border-b border-dark-border text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories" class="hover:bg-dark-surface transition-colors">
              <td class="px-6 py-4 border-b border-dark-border text-white">{{category.id}}</td>
              <td class="px-6 py-4 border-b border-dark-border text-white">{{category.name}}</td>
              <td class="px-6 py-4 border-b border-dark-border">
                <button [routerLink]="['/categories', category.id, 'edit']" class="text-blue-400 hover:text-blue-300 mr-2 transition-colors">Edit</button>
                <button (click)="deleteCategory(category.id)" class="text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-400">
                No categories found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  errorMessage = '';

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.errorMessage = err.message
    });
  }

  deleteCategory(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => this.errorMessage = err.message
      });
    }
  }
} 