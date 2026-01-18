import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="max-w-2xl mx-auto mt-8 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
      <h2 class="text-2xl font-bold mb-6 text-white">Categories Management</h2>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class CategoriesComponent {} 