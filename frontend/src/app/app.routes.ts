import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'books',
    canActivate: [authGuard],
    loadComponent: () => import('./components/books/book-list/book-list.component').then(m => m.BookListComponent)
  },
  {
    path: 'books/new',
    canActivate: [authGuard],
    loadComponent: () => import('./components/books/book-form/book-form.component').then(m => m.BookFormComponent)
  },
  {
    path: 'books/edit/:isbn',
    canActivate: [authGuard],
    loadComponent: () => import('./components/books/book-form/book-form.component').then(m => m.BookFormComponent)
  },
  {
    path: 'authors',
    canActivate: [authGuard],
    loadComponent: () => import('./components/authors/author-list/author-list.component').then(m => m.AuthorListComponent)
  },
  {
    path: 'authors/new',
    canActivate: [authGuard],
    loadComponent: () => import('./components/authors/author-form/author-form.component').then(m => m.AuthorFormComponent)
  },
  {
    path: 'authors/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/authors/author-form/author-form.component').then(m => m.AuthorFormComponent)
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () => import('./components/categories/category-list/category-list.component').then(m => m.CategoryListComponent)
  },
  {
    path: 'categories/new',
    canActivate: [authGuard],
    loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
  },
  {
    path: 'categories/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./components/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
