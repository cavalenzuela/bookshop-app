import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { AuthorService } from './author.service';
import { Book } from '../models/book.model';
import { Author } from '../models/author.model';
import { Category } from '../models/category.model';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    birthDate: '1990-01-01',
    nationality: 'American',
    biography: 'Test biography'
  };

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction'
  };

  const mockBook: Book = {
    isbn: '1234567890',
    title: 'Test Book',
    author: mockAuthor,
    category: mockCategory
  };

  beforeEach(() => {
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BookService,
        { provide: AuthorService, useValue: authorServiceSpy }
      ]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBooks', () => {
    it('should return books array', () => {
      const mockBooks: Book[] = [mockBook];

      service.getBooks().subscribe(books => {
        expect(books).toEqual(mockBooks);
      });

      const req = httpMock.expectOne('/api/books');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(mockBooks);
    });

    it('should handle error and return empty array', () => {
      service.getBooks().subscribe(books => {
        expect(books).toEqual([]);
      });

      const req = httpMock.expectOne('/api/books');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getBook', () => {
    it('should return a single book by ISBN', () => {
      const isbn = '1234567890';

      service.getBook(isbn).subscribe(book => {
        expect(book).toEqual(mockBook);
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBook);
    });

    it('should handle error when getting book', () => {
      const isbn = '1234567890';

      service.getBook(isbn).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createOrUpdateBook', () => {
    it('should create or update book successfully', () => {
      const isbn = '1234567890';
      const bookToSend = {
        isbn: mockBook.isbn,
        title: mockBook.title,
        author: mockBook.author,
        category: mockBook.category
      };

      service.createOrUpdateBook(isbn, mockBook).subscribe(book => {
        expect(book).toEqual(mockBook);
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(bookToSend);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(mockBook);
    });

    it('should throw error when author is invalid', () => {
      const invalidBook = {
        ...mockBook,
        author: null as any
      };

      expect(() => {
        service.createOrUpdateBook('1234567890', invalidBook);
      }).toThrowError('Valid Author is required');
    });

    it('should throw error when author has no id', () => {
      const invalidBook = {
        ...mockBook,
        author: { name: 'Test Author' } as any
      };

      expect(() => {
        service.createOrUpdateBook('1234567890', invalidBook);
      }).toThrowError('Valid Author is required');
    });

    it('should throw error when category is invalid', () => {
      const invalidBook = {
        ...mockBook,
        category: null as any
      };

      expect(() => {
        service.createOrUpdateBook('1234567890', invalidBook);
      }).toThrowError('Valid Category is required');
    });

    it('should throw error when category has no id', () => {
      const invalidBook = {
        ...mockBook,
        category: { name: 'Fiction' } as any
      };

      expect(() => {
        service.createOrUpdateBook('1234567890', invalidBook);
      }).toThrowError('Valid Category is required');
    });

    it('should handle error when creating/updating book', () => {
      const isbn = '1234567890';

      service.createOrUpdateBook(isbn, mockBook).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('partialUpdateBook', () => {
    it('should partially update book', () => {
      const isbn = '1234567890';
      const partialBook = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, title: 'Updated Title' };

      service.partialUpdateBook(isbn, partialBook).subscribe(book => {
        expect(book).toEqual(updatedBook);
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(partialBook);
      req.flush(updatedBook);
    });

    it('should handle error when partially updating book', () => {
      const isbn = '1234567890';
      const partialBook = { title: 'Updated Title' };

      service.partialUpdateBook(isbn, partialBook).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteBook', () => {
    it('should delete book successfully', () => {
      const isbn = '1234567890';

      service.deleteBook(isbn).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting book', () => {
      const isbn = '1234567890';

      service.deleteBook(isbn).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`/api/books/${isbn}`);
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('HTTP options', () => {
    it('should use correct headers for GET requests', () => {
      service.getBooks().subscribe();
      service.getBook('1234567890').subscribe();

      const getBooksReq = httpMock.expectOne('/api/books');
      const getBookReq = httpMock.expectOne('/api/books/1234567890');

      expect(getBooksReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getBooksReq.request.headers.get('Accept')).toBe('application/json');
      expect(getBookReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getBookReq.request.headers.get('Accept')).toBe('application/json');

      getBooksReq.flush([]);
      getBookReq.flush(mockBook);
    });

    it('should use correct headers for PATCH requests', () => {
      service.partialUpdateBook('1234567890', {}).subscribe();

      const patchReq = httpMock.expectOne('/api/books/1234567890');
      expect(patchReq.request.method).toBe('PATCH');
      expect(patchReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(patchReq.request.headers.get('Accept')).toBe('application/json');

      patchReq.flush(mockBook);
    });

    it('should use correct headers for DELETE requests', () => {
      service.deleteBook('1234567890').subscribe();

      const deleteReq = httpMock.expectOne('/api/books/1234567890');
      expect(deleteReq.request.method).toBe('DELETE');
      expect(deleteReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(deleteReq.request.headers.get('Accept')).toBe('application/json');

      deleteReq.flush(null);
    });
  });
});
