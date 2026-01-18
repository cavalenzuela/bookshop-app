import { Author } from './author.model';
import { Category } from './category.model';

export interface Book {
  isbn: string;
  title: string;
  author: Author;
  category: Category;
} 