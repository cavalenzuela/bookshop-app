import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BooksComponent } from './books.component';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Book } from '../../models/book.model';
import { Author } from '../../models/author.model';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthors: Author[] = [
    { id: 1, name: 'Author 1', birthDate: '1990-01-01', nationality: 'American', biography: 'Biography 1' },
    { id: 2, name: 'Author 2', birthDate: '1985-05-15', nationality: 'British', biography: 'Biography 2' }
  ];

  const mockBooks: Book[] = [
    { isbn: '1234567890', title: 'Book 1', author: mockAuthors[0], category: { id: 1, name: 'Fiction' } },
    { isbn: '0987654321', title: 'Book 2', author: mockAuthors[1], category: { id: 2, name: 'Non-Fiction' } }
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'createOrUpdateBook']);
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors']);

    await TestBed.configureTestingModule({
      imports: [BooksComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;

    // Set default return values for service methods
    bookService.getBooks.and.returnValue(of([]));
    bookService.createOrUpdateBook.and.returnValue(of(mockBooks[0]));
    authorService.getAuthors.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty arrays', () => {
    expect(component.books).toEqual([]);
    expect(component.authors).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('should call loadBooks and loadAuthors', () => {
      spyOn(component, 'loadBooks');
      spyOn(component, 'loadAuthors');
      
      component.ngOnInit();
      
      expect(component.loadBooks).toHaveBeenCalled();
      expect(component.loadAuthors).toHaveBeenCalled();
    });
  });

  describe('loadBooks', () => {
    it('should load books and set editing to false', () => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      
      component.loadBooks();
      
      expect(bookService.getBooks).toHaveBeenCalled();
      expect(component.books).toEqual([
        { ...mockBooks[0], editing: false },
        { ...mockBooks[1], editing: false }
      ]);
    });
  });

  describe('loadAuthors', () => {
    it('should load authors', () => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      
      component.loadAuthors();
      
      expect(authorService.getAuthors).toHaveBeenCalled();
      expect(component.authors).toEqual(mockAuthors);
    });
  });

  describe('startEditing', () => {
    it('should set editing to true for the specified book', () => {
      const book = { ...mockBooks[0], editing: false };
      component.books = [book];
      
      component.startEditing(book);
      
      expect(book.editing).toBe(true);
    });
  });

  describe('cancelEditing', () => {
    it('should set editing to false and reload books', () => {
      const book = { ...mockBooks[0], editing: true };
      component.books = [book];
      spyOn(component, 'loadBooks');
      
      component.cancelEditing(book);
      
      expect(book.editing).toBe(false);
      expect(component.loadBooks).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update book and reload books on success', () => {
      const book = { ...mockBooks[0], editing: true };
      component.books = [book];
      bookService.createOrUpdateBook.and.returnValue(of(mockBooks[0]));
      spyOn(component, 'loadBooks');
      
      component.updateBook(book);
      
      expect(bookService.createOrUpdateBook).toHaveBeenCalledWith(book.isbn, mockBooks[0]);
      expect(book.editing).toBe(false);
      expect(component.loadBooks).toHaveBeenCalled();
    });

    it('should call createOrUpdateBook service method', () => {
      const book = { ...mockBooks[0], editing: true };
      component.books = [book];
      bookService.createOrUpdateBook.and.returnValue(of(mockBooks[0]));
      spyOn(component, 'loadBooks');
      
      component.updateBook(book);
      
      expect(bookService.createOrUpdateBook).toHaveBeenCalled();
      expect(book.editing).toBe(false);
      expect(component.loadBooks).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display the page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Books Management');
    });

    it('should display books list title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const listTitle = compiled.querySelector('h3');
      expect(listTitle?.textContent).toContain('Books List');
    });

    it('should display table headers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent).toContain('ISBN');
      expect(headers[1].textContent).toContain('Title');
      expect(headers[2].textContent).toContain('Author');
      expect(headers[3].textContent).toContain('Actions');
    });

    it('should display books in table rows', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should display book data in non-editing mode', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('1234567890');
      expect(firstRow?.textContent).toContain('Book 1');
      expect(firstRow?.textContent).toContain('Author 1');
    });

    it('should show edit button in non-editing mode', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const editButton = compiled.querySelector('button');
      expect(editButton?.textContent).toContain('Edit');
    });

    it('should show save and cancel buttons in editing mode', () => {
      component.books[0].editing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      expect(buttons[0].textContent).toContain('Save');
      expect(buttons[1].textContent).toContain('Cancel');
    });

    it('should show input fields in editing mode', () => {
      component.books[0].editing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const inputs = compiled.querySelectorAll('input');
      const select = compiled.querySelector('select');
      expect(inputs.length).toBe(1); // title input
      expect(select).toBeTruthy(); // author select
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      bookService.getBooks.and.returnValue(of(mockBooks));
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call startEditing when edit button is clicked', () => {
      spyOn(component, 'startEditing');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const editButton = compiled.querySelector('button');
      editButton?.click();
      
      expect(component.startEditing).toHaveBeenCalledWith(component.books[0]);
    });

    it('should call updateBook when save button is clicked', () => {
      component.books[0].editing = true;
      fixture.detectChanges();
      spyOn(component, 'updateBook');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const saveButton = compiled.querySelector('button');
      saveButton?.click();
      
      expect(component.updateBook).toHaveBeenCalledWith(component.books[0]);
    });

    it('should call cancelEditing when cancel button is clicked', () => {
      component.books[0].editing = true;
      fixture.detectChanges();
      spyOn(component, 'cancelEditing');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      const cancelButton = buttons[1];
      cancelButton?.click();
      
      expect(component.cancelEditing).toHaveBeenCalledWith(component.books[0]);
    });
  });
});
