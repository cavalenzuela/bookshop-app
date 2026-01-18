import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  const mockBooks: Book[] = [
    {
      isbn: '1234567890',
      title: 'Book 1',
      author: { id: 1, name: 'Author 1', birthDate: '1990-01-01', nationality: 'American', biography: 'Biography 1' },
      category: { id: 1, name: 'Fiction' }
    },
    {
      isbn: '0987654321',
      title: 'Book 2',
      author: { id: 2, name: 'Author 2', birthDate: '1985-05-15', nationality: 'British', biography: 'Biography 2' },
      category: { id: 2, name: 'Non-Fiction' }
    }
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'deleteBook']);

    await TestBed.configureTestingModule({
      imports: [BookListComponent, RouterTestingModule],
      providers: [
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;

    // Set default return values for service methods
    bookService.getBooks.and.returnValue(of([]));
    bookService.deleteBook.and.returnValue(of(undefined));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.books).toEqual([]);
    expect(component.errorMessage).toBe('');
    expect(component.isLoading).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call loadBooks', () => {
      spyOn(component, 'loadBooks');
      
      component.ngOnInit();
      
      expect(component.loadBooks).toHaveBeenCalled();
    });
  });

  describe('loadBooks', () => {
    it('should load books successfully', () => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      
      component.loadBooks();
      
      expect(bookService.getBooks).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('');
    });

    it('should load books successfully', () => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      
      component.loadBooks();
      
      expect(bookService.getBooks).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('deleteBook', () => {
    it('should delete book when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookService.deleteBook.and.returnValue(of(undefined));
      component.books = [...mockBooks];
      
      component.deleteBook('1234567890');
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this book?');
      expect(bookService.deleteBook).toHaveBeenCalledWith('1234567890');
      expect(component.books.length).toBe(1);
      expect(component.books[0].isbn).toBe('0987654321');
    });

    it('should not delete book when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.books = [...mockBooks];
      
      component.deleteBook('1234567890');
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this book?');
      expect(bookService.deleteBook).not.toHaveBeenCalled();
      expect(component.books.length).toBe(2);
    });

    it('should delete book successfully when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookService.deleteBook.and.returnValue(of(undefined));
      component.books = [...mockBooks];
      
      component.deleteBook('1234567890');
      
      expect(bookService.deleteBook).toHaveBeenCalledWith('1234567890');
      expect(component.books.length).toBe(1);
      expect(component.books[0].isbn).toBe('0987654321');
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display the page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Books List');
    });

    it('should display add new book button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const addButton = compiled.querySelector('a[routerLink="/books/new"]');
      expect(addButton?.textContent).toContain('Add New Book');
    });

    it('should display loading spinner when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('should display error message when present', () => {
      component.errorMessage = 'Error loading books';
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error loading books');
    });

    it('should display books table when not loading', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should display table headers', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent).toContain('Title');
      expect(headers[1].textContent).toContain('Author Name');
      expect(headers[2].textContent).toContain('ISBN');
      expect(headers[3].textContent).toContain('Actions');
    });

    it('should display books in table rows', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should display book data correctly', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('Book 1');
      expect(firstRow?.textContent).toContain('Author 1');
      expect(firstRow?.textContent).toContain('1234567890');
    });

    it('should display edit and delete buttons for each book', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const editButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Edit'));
      const deleteButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Delete'));
      
      expect(editButtons.length).toBe(2);
      expect(deleteButtons.length).toBe(2);
      
      editButtons.forEach(button => {
        expect(button.textContent).toContain('Edit');
      });
      
      deleteButtons.forEach(button => {
        expect(button.textContent).toContain('Delete');
      });
    });

    it('should display no books message when books array is empty', () => {
      component.books = [];
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const noBooksMessage = compiled.querySelector('td[colspan="4"]');
      expect(noBooksMessage?.textContent).toContain('No books found');
    });

    it('should handle books with no author assigned', () => {
      const bookWithoutAuthor = {
        isbn: '1111111111',
        title: 'Book Without Author',
        author: null as any,
        category: { id: 1, name: 'Fiction' }
      };
      component.books = [bookWithoutAuthor];
      component.isLoading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('No author assigned');
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call deleteBook when delete button is clicked', () => {
      spyOn(component, 'deleteBook');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const deleteButtons = Array.from(allButtons).filter(btn => btn.textContent?.includes('Delete'));
      const firstDeleteButton = deleteButtons[0];
      (firstDeleteButton as HTMLButtonElement)?.click();
      
      expect(component.deleteBook).toHaveBeenCalledWith('1234567890');
    });
  });
});
