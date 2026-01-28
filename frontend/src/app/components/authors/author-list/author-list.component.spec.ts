import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthorListComponent } from './author-list.component';
import { AuthorService } from '../../../services/author.service';
import { Author } from '../../../models/author.model';

describe('AuthorListComponent', () => {
  let component: AuthorListComponent;
  let fixture: ComponentFixture<AuthorListComponent>;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthors: Author[] = [
    {
      id: 1,
      name: 'Author 1',
      birthDate: '1990-01-01',
      nationality: 'American',
      biography: 'Biography 1'
    },
    {
      id: 2,
      name: 'Author 2',
      birthDate: '1985-05-15',
      nationality: 'British',
      biography: 'Biography 2'
    }
  ];

  beforeEach(async () => {
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors', 'deleteAuthor']);
    const activatedRouteMock = {
      snapshot: { params: {} },
      params: of({})
    };

    await TestBed.configureTestingModule({
      imports: [AuthorListComponent, RouterTestingModule],
      providers: [
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorListComponent);
    component = fixture.componentInstance;
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.authors()).toEqual([]);
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call loadAuthors', () => {
      spyOn(component, 'loadAuthors');

      component.ngOnInit();

      expect(component.loadAuthors).toHaveBeenCalled();
    });
  });

  describe('loadAuthors', () => {
    it('should load authors successfully', () => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));

      component.loadAuthors();

      expect(authorService.getAuthors).toHaveBeenCalled();
      expect(component.authors()).toEqual(mockAuthors);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBe('');
    });

    it('should handle error when loading authors', () => {
      const error = new Error('Failed to load authors');
      authorService.getAuthors.and.returnValue(throwError(() => error));

      component.loadAuthors();

      expect(component.errorMessage()).toBe('Error loading authors: Failed to load authors');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('deleteAuthor', () => {
    it('should delete author when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      authorService.deleteAuthor.and.returnValue(of(undefined));
      component.authors.set([...mockAuthors]);

      component.deleteAuthor(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this author?');
      expect(authorService.deleteAuthor).toHaveBeenCalledWith(1);
      expect(component.authors().length).toBe(1);
      expect(component.authors()[0].id).toBe(2);
    });

    it('should not delete author when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.authors.set([...mockAuthors]);

      component.deleteAuthor(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this author?');
      expect(authorService.deleteAuthor).not.toHaveBeenCalled();
      expect(component.authors().length).toBe(2);
    });

    it('should handle error when deleting author', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const error = new Error('Failed to delete author');
      authorService.deleteAuthor.and.returnValue(throwError(() => error));
      component.authors.set([...mockAuthors]);

      component.deleteAuthor(1);

      expect(component.errorMessage()).toBe('Error deleting author: Failed to delete author');
      expect(component.authors().length).toBe(2); // Should not remove from array on error
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display the page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Authors List');
    });

    it('should display add new author button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const addButton = compiled.querySelector('a[routerLink="/authors/new"]');
      expect(addButton?.textContent).toContain('Add New Author');
    });

    it('should display loading spinner when isLoading is true', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('should display error message when present', () => {
      component.errorMessage.set('Error loading authors');
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error loading authors');
    });

    it('should display authors table when not loading', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should display table headers', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent).toContain('Name');
      expect(headers[1].textContent).toContain('Birth Date');
      expect(headers[2].textContent).toContain('Nationality');
      expect(headers[3].textContent).toContain('Actions');
    });

    it('should display authors in table rows', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should display author data correctly', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('Author 1');
      expect(firstRow?.textContent).toContain('American');
    });

    it('should display edit and delete buttons for each author', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const editButtons = Array.from(allButtons).filter(btn => btn.textContent?.trim() === 'Edit');
      const deleteButtons = Array.from(allButtons).filter(btn => btn.textContent?.trim() === 'Delete');

      expect(editButtons.length).toBe(2);
      expect(deleteButtons.length).toBe(2);

      editButtons.forEach(button => {
        expect(button.textContent).toContain('Edit');
      });

      deleteButtons.forEach(button => {
        expect(button.textContent).toContain('Delete');
      });
    });

    it('should display no authors message when authors array is empty', () => {
      component.authors.set([]);
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const noAuthorsMessage = compiled.querySelector('td[colspan="4"]');
      expect(noAuthorsMessage?.textContent).toContain('No authors found');
    });

    it('should format birth date correctly', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      // The date pipe should format the date as yyyy-MM-dd
      expect(firstRow?.textContent).toContain('1990-01-01');
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call deleteAuthor when delete button is clicked', () => {
      spyOn(component, 'deleteAuthor');

      const compiled = fixture.nativeElement as HTMLElement;
      const allButtons = compiled.querySelectorAll('button');
      const deleteButton = Array.from(allButtons).find(btn => btn.textContent?.trim() === 'Delete');

      (deleteButton as HTMLButtonElement)?.click();

      expect(component.deleteAuthor).toHaveBeenCalledWith(1);
    });
  });
});
