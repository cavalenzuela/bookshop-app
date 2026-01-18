import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CategoryFormComponent } from './category-form.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: Router;
  let route: jasmine.SpyObj<ActivatedRoute>;

  const mockCategory: Category = {
    id: 1,
    name: 'Test Category'
  };

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategory', 'createCategory', 'updateCategory']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: jasmine.createSpy('get') } }
    });

    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent, RouterTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    // Set default return values for service methods
    categoryService.getCategory.and.returnValue(of(mockCategory));
    categoryService.createCategory.and.returnValue(of(mockCategory));
    categoryService.updateCategory.and.returnValue(of(mockCategory));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.category).toEqual({ name: '' });
    expect(component.isEditing).toBe(false);
    expect(component.isSubmitting).toBe(false);
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should set editing mode and load category if ID is provided', () => {
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
      spyOn(component, 'loadCategory');
      
      component.ngOnInit();
      
      expect(component.isEditing).toBe(true);
      expect(component.loadCategory).toHaveBeenCalledWith(1);
    });

    it('should not set editing mode if no ID is provided', () => {
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.isEditing).toBe(false);
    });
  });

  describe('loadCategory', () => {
    it('should load category successfully', () => {
      categoryService.getCategory.and.returnValue(of(mockCategory));
      
      component.loadCategory(1);
      
      expect(categoryService.getCategory).toHaveBeenCalledWith(1);
      expect(component.category).toEqual(mockCategory);
    });

    it('should handle error when loading category', () => {
      const error = new Error('Failed to load category');
      categoryService.getCategory.and.returnValue(throwError(() => error));
      
      component.loadCategory(1);
      
      expect(component.errorMessage).toBe('Failed to load category');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.category = { ...mockCategory };
    });

    it('should update category when in editing mode', () => {
      component.isEditing = true;
      component.category.id = 1;
      categoryService.updateCategory.and.returnValue(of(mockCategory));
      
      component.onSubmit();
      
      expect(categoryService.updateCategory).toHaveBeenCalledWith(1, component.category);
      expect(component.successMessage).toBe('Category updated successfully!');
      expect(component.isSubmitting).toBe(true);
    });

    it('should create category when not in editing mode', () => {
      component.isEditing = false;
      categoryService.createCategory.and.returnValue(of(mockCategory));
      
      component.onSubmit();
      
      expect(categoryService.createCategory).toHaveBeenCalledWith(component.category);
      expect(component.successMessage).toBe('Category created successfully!');
      expect(component.isSubmitting).toBe(true);
    });

    it('should handle error when updating category', () => {
      component.isEditing = true;
      component.category.id = 1;
      const error = new Error('Failed to update category');
      categoryService.updateCategory.and.returnValue(throwError(() => error));
      
      component.onSubmit();
      
      expect(component.errorMessage).toBe('Failed to update category');
      expect(component.isSubmitting).toBe(false);
    });

    it('should handle error when creating category', () => {
      component.isEditing = false;
      const error = new Error('Failed to create category');
      categoryService.createCategory.and.returnValue(throwError(() => error));
      
      component.onSubmit();
      
      expect(component.errorMessage).toBe('Failed to create category');
      expect(component.isSubmitting).toBe(false);
    });

    it('should navigate to categories list after successful operation', (done) => {
      categoryService.createCategory.and.returnValue(of(mockCategory));
      spyOn(router, 'navigate');
      
      component.onSubmit();
      
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/categories']);
        done();
      }, 1300);
    });
  });

  describe('template rendering', () => {
    it('should display correct title for new category', () => {
      component.isEditing = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Add New Category');
    });

    it('should display correct title for editing category', () => {
      component.isEditing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Edit Category');
    });

    it('should display success message when present', () => {
      component.successMessage = 'Category created successfully!';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const successMessage = compiled.querySelector('.bg-green-900');
      expect(successMessage?.textContent).toContain('Category created successfully!');
    });

    it('should display error message when present', () => {
      component.errorMessage = 'Error creating category';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error creating category');
    });

    it('should have name input field', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const nameInput = compiled.querySelector('input[name="name"]');
      expect(nameInput).toBeTruthy();
    });

    it('should display correct button text for creating category', () => {
      component.isEditing = false;
      component.isSubmitting = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Create Category');
    });

    it('should display correct button text for updating category', () => {
      component.isEditing = true;
      component.isSubmitting = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Update Category');
    });

    it('should display saving text when submitting', () => {
      component.isSubmitting = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Saving...');
    });

    it('should disable buttons when submitting', () => {
      component.isSubmitting = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      const cancelButton = compiled.querySelector('button[type="button"]');
      
      expect((submitButton as HTMLButtonElement)?.disabled).toBe(true);
      expect((cancelButton as HTMLButtonElement)?.disabled).toBe(true);
    });

    it('should have cancel button with correct router link', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const cancelButton = compiled.querySelector('button[routerLink="/categories"]');
      expect(cancelButton?.textContent).toContain('Cancel');
    });
  });

  describe('form validation', () => {
    it('should call service method when form is submitted', () => {
      component.category = { name: 'Test Category' };
      component.isEditing = false;
      categoryService.createCategory.and.returnValue(of(mockCategory));
      
      component.onSubmit();
      
      expect(categoryService.createCategory).toHaveBeenCalledWith(component.category);
      expect(component.successMessage).toBe('Category created successfully!');
    });
  });
});
