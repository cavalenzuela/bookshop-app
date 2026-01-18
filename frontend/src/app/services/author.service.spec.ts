import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthorService } from './author.service';
import { Author } from '../models/author.model';

describe('AuthorService', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;

  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    birthDate: '1990-01-01',
    nationality: 'American',
    biography: 'Test biography'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorService]
    });
    service = TestBed.inject(AuthorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createAuthor', () => {
    it('should create author successfully', () => {
      const newAuthor: Author = {
        name: 'New Author',
        birthDate: '1990-01-01',
        nationality: 'American',
        biography: 'Test biography'
      };
      const createdAuthor = { ...newAuthor, id: 1 };

      service.createAuthor(newAuthor).subscribe(author => {
        expect(author).toEqual(createdAuthor);
      });

      const req = httpMock.expectOne('/api/authors');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAuthor);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(createdAuthor);
    });

    it('should handle error when creating author', () => {
      const newAuthor: Author = {
        name: 'New Author',
        birthDate: '1990-01-01',
        nationality: 'American',
        biography: 'Test biography'
      };

      service.createAuthor(newAuthor).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne('/api/authors');
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAuthors', () => {
    it('should return authors array', () => {
      const mockAuthors: Author[] = [mockAuthor];

      service.getAuthors().subscribe(authors => {
        expect(authors).toEqual(mockAuthors);
      });

      const req = httpMock.expectOne('/api/authors');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(mockAuthors);
    });

    it('should handle error when getting authors', () => {
      service.getAuthors().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne('/api/authors');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getAuthor', () => {
    it('should return a single author by ID', () => {
      const id = 1;

      service.getAuthor(id).subscribe(author => {
        expect(author).toEqual(mockAuthor);
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAuthor);
    });

    it('should handle error when getting author', () => {
      const id = 1;

      service.getAuthor(id).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      req.flush('Author not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateAuthor', () => {
    it('should update author successfully', () => {
      const id = 1;
      const updatedAuthor = { ...mockAuthor, name: 'Updated Author' };

      service.updateAuthor(id, updatedAuthor).subscribe(author => {
        expect(author).toEqual(updatedAuthor);
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedAuthor);
      req.flush(updatedAuthor);
    });

    it('should handle error when updating author', () => {
      const id = 1;
      const updatedAuthor = { ...mockAuthor, name: 'Updated Author' };

      service.updateAuthor(id, updatedAuthor).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('partialUpdateAuthor', () => {
    it('should partially update author', () => {
      const id = 1;
      const partialAuthor = { name: 'Partially Updated Author' };
      const updatedAuthor = { ...mockAuthor, name: 'Partially Updated Author' };

      service.partialUpdateAuthor(id, partialAuthor).subscribe(author => {
        expect(author).toEqual(updatedAuthor);
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(partialAuthor);
      req.flush(updatedAuthor);
    });

    it('should handle error when partially updating author', () => {
      const id = 1;
      const partialAuthor = { name: 'Partially Updated Author' };

      service.partialUpdateAuthor(id, partialAuthor).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      req.flush('Author not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteAuthor', () => {
    it('should delete author successfully', () => {
      const id = 1;

      service.deleteAuthor(id).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting author', () => {
      const id = 1;

      service.deleteAuthor(id).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`/api/authors/${id}`);
      req.flush('Author not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('handleError', () => {
    it('should handle client-side error', () => {
      const clientError = new ErrorEvent('Client error', {
        message: 'Network error'
      });

      service.getAuthors().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Network error');
        }
      });

      const req = httpMock.expectOne('/api/authors');
      req.error(clientError);
    });

    it('should handle server-side error', () => {
      service.getAuthors().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
          expect(error.message).toContain('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('/api/authors');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('HTTP options', () => {
    it('should use correct headers for GET requests', () => {
      service.getAuthors().subscribe();
      service.getAuthor(1).subscribe();

      const getAuthorsReq = httpMock.expectOne('/api/authors');
      const getAuthorReq = httpMock.expectOne('/api/authors/1');

      expect(getAuthorsReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getAuthorsReq.request.headers.get('Accept')).toBe('application/json');
      expect(getAuthorReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getAuthorReq.request.headers.get('Accept')).toBe('application/json');

      getAuthorsReq.flush([mockAuthor]);
      getAuthorReq.flush(mockAuthor);
    });

    it('should use correct headers for POST requests', () => {
      service.createAuthor(mockAuthor).subscribe();

      const createReq = httpMock.expectOne('/api/authors');
      expect(createReq.request.method).toBe('POST');
      expect(createReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(createReq.request.headers.get('Accept')).toBe('application/json');

      createReq.flush(mockAuthor);
    });

    it('should use correct headers for PUT requests', () => {
      service.updateAuthor(1, mockAuthor).subscribe();

      const updateReq = httpMock.expectOne('/api/authors/1');
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(updateReq.request.headers.get('Accept')).toBe('application/json');

      updateReq.flush(mockAuthor);
    });

    it('should use correct headers for PATCH requests', () => {
      service.partialUpdateAuthor(1, {}).subscribe();

      const patchReq = httpMock.expectOne('/api/authors/1');
      expect(patchReq.request.method).toBe('PATCH');
      expect(patchReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(patchReq.request.headers.get('Accept')).toBe('application/json');

      patchReq.flush(mockAuthor);
    });

    it('should use correct headers for DELETE requests', () => {
      service.deleteAuthor(1).subscribe();

      const deleteReq = httpMock.expectOne('/api/authors/1');
      expect(deleteReq.request.method).toBe('DELETE');
      expect(deleteReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(deleteReq.request.headers.get('Accept')).toBe('application/json');

      deleteReq.flush(null);
    });
  });
});
