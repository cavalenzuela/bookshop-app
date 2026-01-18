import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createCategory', () => {
    it('should create category successfully', () => {
      const newCategory: Category = {
        name: 'New Category'
      };
      const createdCategory = { ...newCategory, id: 1 };

      service.createCategory(newCategory).subscribe(category => {
        expect(category).toEqual(createdCategory);
      });

      const req = httpMock.expectOne('/api/categories');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCategory);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(createdCategory);
    });

    it('should handle error when creating category', () => {
      const newCategory: Category = {
        name: 'New Category'
      };

      service.createCategory(newCategory).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne('/api/categories');
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getCategories', () => {
    it('should return categories array', () => {
      const mockCategories: Category[] = [mockCategory];

      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne('/api/categories');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush(mockCategories);
    });

    it('should handle error when getting categories', () => {
      service.getCategories().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne('/api/categories');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCategory', () => {
    it('should return a single category by ID', () => {
      const id = 1;

      service.getCategory(id).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });

    it('should handle error when getting category', () => {
      const id = 1;

      service.getCategory(id).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      req.flush('Category not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', () => {
      const id = 1;
      const updatedCategory = { ...mockCategory, name: 'Updated Category' };

      service.updateCategory(id, updatedCategory).subscribe(category => {
        expect(category).toEqual(updatedCategory);
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedCategory);
      req.flush(updatedCategory);
    });

    it('should handle error when updating category', () => {
      const id = 1;
      const updatedCategory = { ...mockCategory, name: 'Updated Category' };

      service.updateCategory(id, updatedCategory).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', () => {
      const id = 1;

      service.deleteCategory(id).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting category', () => {
      const id = 1;

      service.deleteCategory(id).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`/api/categories/${id}`);
      req.flush('Category not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('handleError', () => {
    it('should handle client-side error', () => {
      const clientError = new ErrorEvent('Client error', {
        message: 'Network error'
      });

      service.getCategories().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Network error');
        }
      });

      const req = httpMock.expectOne('/api/categories');
      req.error(clientError);
    });

    it('should handle server-side error', () => {
      service.getCategories().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
          expect(error.message).toContain('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('/api/categories');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('HTTP options', () => {
    it('should use correct headers for GET requests', () => {
      service.getCategories().subscribe();
      service.getCategory(1).subscribe();

      const getCategoriesReq = httpMock.expectOne('/api/categories');
      const getCategoryReq = httpMock.expectOne('/api/categories/1');

      expect(getCategoriesReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getCategoriesReq.request.headers.get('Accept')).toBe('application/json');
      expect(getCategoryReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(getCategoryReq.request.headers.get('Accept')).toBe('application/json');

      getCategoriesReq.flush([mockCategory]);
      getCategoryReq.flush(mockCategory);
    });

    it('should use correct headers for POST requests', () => {
      service.createCategory(mockCategory).subscribe();

      const createReq = httpMock.expectOne('/api/categories');
      expect(createReq.request.method).toBe('POST');
      expect(createReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(createReq.request.headers.get('Accept')).toBe('application/json');

      createReq.flush(mockCategory);
    });

    it('should use correct headers for PUT requests', () => {
      service.updateCategory(1, mockCategory).subscribe();

      const updateReq = httpMock.expectOne('/api/categories/1');
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(updateReq.request.headers.get('Accept')).toBe('application/json');

      updateReq.flush(mockCategory);
    });

    it('should use correct headers for DELETE requests', () => {
      service.deleteCategory(1).subscribe();

      const deleteReq = httpMock.expectOne('/api/categories/1');
      expect(deleteReq.request.method).toBe('DELETE');
      expect(deleteReq.request.headers.get('Content-Type')).toBe('application/json');
      expect(deleteReq.request.headers.get('Accept')).toBe('application/json');

      deleteReq.flush(null);
    });
  });
});
