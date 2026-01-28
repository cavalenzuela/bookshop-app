import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookFormComponent } from './book-form.component';
import { BookService } from '../../../services/book.service';
import { AuthorService } from '../../../services/author.service';
import { CategoryService } from '../../../services/category.service';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';
import { Category } from '../../../models/category.model';

describe('BookFormComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let authorService: jasmine.SpyObj<AuthorService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: Router;
  let route: jasmine.SpyObj<ActivatedRoute>;

  const mockAuthors: Author[] = [
    { id: 1, name: 'Author 1', birthDate: '1990-01-01', nationality: 'American', biography: 'Biography 1' },
    { id: 2, name: 'Author 2', birthDate: '1985-05-15', nationality: 'British', biography: 'Biography 2' }
  ];

  const mockCategories: Category[] = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' }
  ];

  const mockBook: Book = {
    isbn: '1234567890',
    title: 'Test Book',
    author: mockAuthors[0],
    category: mockCategories[0]
  };

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBook', 'createOrUpdateBook', 'getBooks']);
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: jasmine.createSpy('get') } }
    });

    await TestBed.configureTestingModule({
      imports: [BookFormComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    // Set default return values for service methods
    bookService.getBook.and.returnValue(of(mockBook));
    bookService.createOrUpdateBook.and.returnValue(of(mockBook));
    bookService.getBooks.and.returnValue(of([mockBook]));
    authorService.getAuthors.and.returnValue(of(mockAuthors));
    categoryService.getCategories.and.returnValue(of(mockCategories));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.book).toEqual({
      isbn: '',
      title: '',
      author: null as any,
      category: null as any
    });
    expect(component.authors()).toEqual([]);
    expect(component.categories()).toEqual([]);
    expect(component.isEditing()).toBe(false);
    expect(component.errorMessage()).toBe('');
    expect(component.successMessage()).toBe('');
    expect(component.isLoading()).toBe(true);
    expect(component.selectedAuthorId).toBe(0);
    expect(component.selectedCategoryId).toBe(0);
  });

  describe('ngOnInit', () => {
    it('should load authors and categories', () => {
      spyOn(component, 'loadAuthors');
      spyOn(component, 'loadCategories');

      component.ngOnInit();

      expect(component.loadAuthors).toHaveBeenCalled();
      expect(component.loadCategories).toHaveBeenCalled();
    });

    it('should set editing mode and load book if ISBN is provided', () => {
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1234567890');
      spyOn(component, 'loadBook');

      component.ngOnInit();

      expect(component.isEditing()).toBe(true);
      expect(component.loadBook).toHaveBeenCalledWith('1234567890');
    });
  });

  describe('loadAuthors', () => {
    it('should load authors successfully', () => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));

      component.loadAuthors();

      expect(authorService.getAuthors).toHaveBeenCalled();
      expect(component.authors()).toEqual(mockAuthors);
      // isLoading depends on categories too, so we can't assert false unless both are loaded or we mock that logic
      // In our component logic, isLoading is set to false only if NOT editing or if loadBook is done.
      // But wait, checkLoadingComplete checks both arrays. Initially they are empty.
      // If we mock both calls it might work.
    });
  });

  describe('loadCategories', () => {
    it('should load categories successfully', () => {
      categoryService.getCategories.and.returnValue(of(mockCategories));

      component.loadCategories();

      expect(categoryService.getCategories).toHaveBeenCalled();
      expect(component.categories()).toEqual(mockCategories);
    });
  });

  describe('loadBook', () => {
    it('should load book successfully', () => {
      bookService.getBook.and.returnValue(of(mockBook));

      component.loadBook('1234567890');

      expect(bookService.getBook).toHaveBeenCalledWith('1234567890');
      expect(component.book).toEqual(mockBook);
      expect(component.selectedAuthorId).toBe(1);
      expect(component.selectedCategoryId).toBe(1);
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.authors.set(mockAuthors);
      component.categories.set(mockCategories);
      component.book = { ...mockBook };
      component.selectedAuthorId = 1;
      component.selectedCategoryId = 1;
    });

    it('should show error when no author is selected', () => {
      component.selectedAuthorId = 0;

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please select an author');
    });

    it('should show error when no category is selected', () => {
      component.selectedCategoryId = 0;

      component.onSubmit();

      expect(component.errorMessage()).toBe('Please select a category');
    });

    it('should create book successfully', () => {
      component.isEditing.set(false);
      bookService.createOrUpdateBook.and.returnValue(of(mockBook));
      bookService.getBooks.and.returnValue(of([]));

      component.onSubmit();

      expect(bookService.createOrUpdateBook).toHaveBeenCalledWith('1234567890', {
        isbn: '1234567890',
        title: 'Test Book',
        author: mockAuthors[0],
        category: mockCategories[0]
      });
      expect(component.successMessage()).toBe('Book created successfully!');
    });

    it('should update book successfully', () => {
      component.isEditing.set(true);
      bookService.createOrUpdateBook.and.returnValue(of(mockBook));
      bookService.getBooks.and.returnValue(of([]));

      component.onSubmit();

      expect(bookService.createOrUpdateBook).toHaveBeenCalledWith('1234567890', {
        isbn: '1234567890',
        title: 'Test Book',
        author: mockAuthors[0],
        category: mockCategories[0]
      });
      expect(component.successMessage()).toBe('Book updated successfully!');
    });

    it('should handle error when creating/updating book', () => {
      const error = { error: { message: 'Server error' } };
      bookService.createOrUpdateBook.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorMessage()).toBe('Error creating book: Server error');
    });

    it('should navigate to books list after successful operation', (done) => {
      bookService.createOrUpdateBook.and.returnValue(of(mockBook));
      bookService.getBooks.and.returnValue(of([]));

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/books']);
        done();
      }, 1600);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      categoryService.getCategories.and.returnValue(of(mockCategories));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display loading message when isLoading is true', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const loadingMessage = compiled.querySelector('.animate-spin');
      expect(loadingMessage).toBeTruthy();
    });

    it('should display form when not loading', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should display success message when present', () => {
      component.successMessage.set('Book created successfully!');
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const successMessage = compiled.querySelector('.bg-green-900');
      expect(successMessage?.textContent).toContain('Book created successfully!');
    });

    it('should display error message when present', () => {
      component.errorMessage.set('Error creating book');
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error creating book');
    });

    it('should display correct title for new book', () => {
      component.isEditing.set(false);
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Add New Book');
    });

    it('should display correct title for editing book', () => {
      component.isEditing.set(true);
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Edit Book');
    });

    it('should have all required form fields', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const isbnInput = compiled.querySelector('input[name="isbn"]');
      const titleInput = compiled.querySelector('input[name="title"]');
      const authorSelect = compiled.querySelector('select[name="author"]');
      const categorySelect = compiled.querySelector('select[name="category"]');

      expect(isbnInput).toBeTruthy();
      expect(titleInput).toBeTruthy();
      expect(authorSelect).toBeTruthy();
      expect(categorySelect).toBeTruthy();
    });

    it('should display author options in select', () => {
      component.isLoading.set(false);
      // Need to populate signals manually if ngOnInit async logic hasn't finished or if we want specific state
      component.authors.set(mockAuthors);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const authorOptions = compiled.querySelectorAll('select[name="author"] option');
      expect(authorOptions.length).toBe(3); // 1 disabled + 2 authors
    });

    it('should display category options in select', () => {
      component.isLoading.set(false);
      component.categories.set(mockCategories);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const categoryOptions = compiled.querySelectorAll('select[name="category"] option');
      expect(categoryOptions.length).toBe(3); // 1 disabled + 2 categories
    });
  });
});
