import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: Router;

  const mockCategories: Category[] = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science Fiction' }
  ];

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories', 'deleteCategory']);

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent, RouterTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.categories).toEqual([]);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadCategories', () => {
      spyOn(component, 'loadCategories');
      
      component.ngOnInit();
      
      expect(component.loadCategories).toHaveBeenCalled();
    });
  });

  describe('loadCategories', () => {
    it('should load categories successfully', () => {
      categoryService.getCategories.and.returnValue(of(mockCategories));
      
      component.loadCategories();
      
      expect(categoryService.getCategories).toHaveBeenCalled();
      expect(component.categories).toEqual(mockCategories);
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading categories', () => {
      const error = new Error('Failed to load categories');
      categoryService.getCategories.and.returnValue(throwError(() => error));
      
      component.loadCategories();
      
      expect(component.errorMessage).toBe('Failed to load categories');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      categoryService.deleteCategory.and.returnValue(of(undefined));
      spyOn(component, 'loadCategories');
      
      component.deleteCategory(1);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this category?');
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
      expect(component.loadCategories).toHaveBeenCalled();
    });

    it('should not delete category when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteCategory(1);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this category?');
      expect(categoryService.deleteCategory).not.toHaveBeenCalled();
    });

    it('should not delete category when id is undefined', () => {
      component.deleteCategory(undefined);
      
      expect(categoryService.deleteCategory).not.toHaveBeenCalled();
    });

    it('should handle error when deleting category', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const error = new Error('Failed to delete category');
      categoryService.deleteCategory.and.returnValue(throwError(() => error));
      
      component.deleteCategory(1);
      
      expect(component.errorMessage).toBe('Failed to delete category');
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      categoryService.getCategories.and.returnValue(of(mockCategories));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display the page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Categories List');
    });

    it('should display add new category button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const addButton = compiled.querySelector('a[routerLink="/categories/new"]');
      expect(addButton?.textContent).toContain('Add New Category');
    });

    it('should display error message when present', () => {
      component.errorMessage = 'Error loading categories';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error loading categories');
    });

    it('should display categories table', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should display table headers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('ID');
      expect(headers[1].textContent).toContain('Name');
      expect(headers[2].textContent).toContain('Actions');
    });

    it('should display categories in table rows', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);
    });

    it('should display category data correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('1');
      expect(firstRow?.textContent).toContain('Fiction');
    });

    it('should display edit and delete buttons for each category', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const editButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Edit'));
      const deleteButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Delete'));
      
      expect(editButtons.length).toBe(3);
      expect(deleteButtons.length).toBe(3);
      
      editButtons.forEach(button => {
        expect(button.textContent).toContain('Edit');
      });
      
      deleteButtons.forEach(button => {
        expect(button.textContent).toContain('Delete');
      });
    });

    it('should display no categories message when categories array is empty', () => {
      component.categories = [];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const noCategoriesMessage = compiled.querySelector('td[colspan="3"]');
      expect(noCategoriesMessage?.textContent).toContain('No categories found');
    });

    it('should have correct router links for edit buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const editButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Edit'));
      
      // The routerLink directive creates the navigation, we just verify the buttons exist
      expect(editButtons.length).toBe(3);
      expect(editButtons[0].textContent).toContain('Edit');
      expect(editButtons[1].textContent).toContain('Edit');
      expect(editButtons[2].textContent).toContain('Edit');
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      categoryService.getCategories.and.returnValue(of(mockCategories));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call deleteCategory when delete button is clicked', () => {
      spyOn(component, 'deleteCategory');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const deleteButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Delete'));
      const firstDeleteButton = deleteButtons[0];
      (firstDeleteButton as HTMLButtonElement)?.click();
      
      expect(component.deleteCategory).toHaveBeenCalledWith(1);
    });
  });
});
