import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthorsComponent } from './authors.component';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthors: Author[] = [
    { id: 1, name: 'Author 1', birthDate: '1990-01-01', nationality: 'American', biography: 'Biography 1' },
    { id: 2, name: 'Author 2', birthDate: '1985-05-15', nationality: 'British', biography: 'Biography 2' }
  ];

  beforeEach(async () => {
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', [
      'getAuthors', 'createAuthor', 'updateAuthor', 'deleteAuthor'
    ]);

    await TestBed.configureTestingModule({
      imports: [AuthorsComponent],
      providers: [
        { provide: AuthorService, useValue: authorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;

    // Set default return values for service methods
    authorService.getAuthors.and.returnValue(of([]));
    authorService.createAuthor.and.returnValue(of(mockAuthors[0]));
    authorService.updateAuthor.and.returnValue(of(mockAuthors[0]));
    authorService.deleteAuthor.and.returnValue(of(undefined));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty arrays and default newAuthor', () => {
    expect(component.authors).toEqual([]);
    expect(component.newAuthor).toEqual({ name: '', birthDate: '', nationality: '', biography: '' });
  });

  describe('ngOnInit', () => {
    it('should call loadAuthors', () => {
      spyOn(component, 'loadAuthors');
      
      component.ngOnInit();
      
      expect(component.loadAuthors).toHaveBeenCalled();
    });
  });

  describe('loadAuthors', () => {
    it('should load authors and set editing to false', () => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      
      component.loadAuthors();
      
      expect(authorService.getAuthors).toHaveBeenCalled();
      expect(component.authors).toEqual([
        { ...mockAuthors[0], editing: false },
        { ...mockAuthors[1], editing: false }
      ]);
    });
  });

  describe('createAuthor', () => {
    it('should create author when name and age are provided', () => {
      component.newAuthor = { name: 'New Author', birthDate: '1990-01-01', nationality: 'American', biography: 'Test biography' };
      authorService.createAuthor.and.returnValue(of(mockAuthors[0]));
      spyOn(component, 'loadAuthors');
      
      component.createAuthor();
      
      expect(authorService.createAuthor).toHaveBeenCalledWith({ name: 'New Author', birthDate: '1990-01-01', nationality: 'American', biography: 'Test biography' });
      expect(component.loadAuthors).toHaveBeenCalled();
      expect(component.newAuthor).toEqual({ name: '', birthDate: '', nationality: '', biography: '' });
    });

    it('should not create author when name is empty', () => {
      component.newAuthor = { name: '', birthDate: '1990-01-01', nationality: 'American', biography: 'Test biography' };
      
      component.createAuthor();
      
      expect(authorService.createAuthor).not.toHaveBeenCalled();
    });

    it('should not create author when age is 0', () => {
      component.newAuthor = { name: 'New Author', birthDate: '', nationality: 'American', biography: 'Test biography' };
      
      component.createAuthor();
      
      expect(authorService.createAuthor).not.toHaveBeenCalled();
    });
  });

  describe('startEditing', () => {
    it('should set editing to true for the specified author', () => {
      const author = { ...mockAuthors[0], editing: false };
      component.authors = [author];
      
      component.startEditing(author);
      
      expect(author.editing).toBe(true);
    });
  });

  describe('cancelEditing', () => {
    it('should set editing to false and reload authors', () => {
      const author = { ...mockAuthors[0], editing: true };
      component.authors = [author];
      spyOn(component, 'loadAuthors');
      
      component.cancelEditing(author);
      
      expect(author.editing).toBe(false);
      expect(component.loadAuthors).toHaveBeenCalled();
    });
  });

  describe('updateAuthor', () => {
    it('should update author and reload authors on success', () => {
      const author = { ...mockAuthors[0], editing: true };
      component.authors = [author];
      authorService.updateAuthor.and.returnValue(of(mockAuthors[0]));
      spyOn(component, 'loadAuthors');
      
      component.updateAuthor(author);
      
      expect(authorService.updateAuthor).toHaveBeenCalledWith(1, mockAuthors[0]);
      expect(author.editing).toBe(false);
      expect(component.loadAuthors).toHaveBeenCalled();
    });

    it('should not update author when id is not provided', () => {
      const author = { ...mockAuthors[0], editing: true, id: undefined };
      component.authors = [author];
      
      component.updateAuthor(author);
      
      expect(authorService.updateAuthor).not.toHaveBeenCalled();
    });

    it('should call updateAuthor service method', () => {
      const author = { ...mockAuthors[0], editing: true };
      component.authors = [author];
      authorService.updateAuthor.and.returnValue(of(mockAuthors[0]));
      spyOn(component, 'loadAuthors');
      
      component.updateAuthor(author);
      
      expect(authorService.updateAuthor).toHaveBeenCalled();
      expect(author.editing).toBe(false);
      expect(component.loadAuthors).toHaveBeenCalled();
    });
  });

  describe('deleteAuthor', () => {
    it('should delete author when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      authorService.deleteAuthor.and.returnValue(of(undefined));
      spyOn(component, 'loadAuthors');
      
      component.deleteAuthor(1);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this author?');
      expect(authorService.deleteAuthor).toHaveBeenCalledWith(1);
      expect(component.loadAuthors).toHaveBeenCalled();
    });

    it('should not delete author when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.deleteAuthor(1);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this author?');
      expect(authorService.deleteAuthor).not.toHaveBeenCalled();
    });

    it('should call deleteAuthor service method when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      authorService.deleteAuthor.and.returnValue(of(undefined));
      spyOn(component, 'loadAuthors');
      
      component.deleteAuthor(1);
      
      expect(authorService.deleteAuthor).toHaveBeenCalled();
      expect(component.loadAuthors).toHaveBeenCalled();
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
      expect(title?.textContent).toContain('Authors Management');
    });

    it('should display add author form', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const formTitle = compiled.querySelector('h3');
      expect(formTitle?.textContent).toContain('Add New Author');
    });

    it('should display form inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const inputs = compiled.querySelectorAll('input');
      expect(inputs.length).toBe(3); // name, birthDate, and nationality inputs
    });

    it('should display authors list title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const listTitles = compiled.querySelectorAll('h3');
      expect(listTitles[1].textContent).toContain('Authors List');
    });

    it('should display table headers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');
      expect(headers.length).toBe(4);
      expect(headers[0].textContent).toContain('Name');
      expect(headers[1].textContent).toContain('Birth Date');
      expect(headers[2].textContent).toContain('Nationality');
      expect(headers[3].textContent).toContain('Actions');
    });

    it('should display authors in table rows', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should display author data in non-editing mode', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstRow = compiled.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('Author 1');
      expect(firstRow?.textContent).toContain('1990-01-01');
      expect(firstRow?.textContent).toContain('American');
    });

    it('should show edit and delete buttons in non-editing mode', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const editButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Edit'));
      const deleteButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Delete'));
      expect(editButton?.textContent).toContain('Edit');
      expect(deleteButton?.textContent).toContain('Delete');
    });

    it('should show save and cancel buttons in editing mode', () => {
      component.authors[0].editing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const saveButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Save'));
      const cancelButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Cancel'));
      expect(saveButton?.textContent).toContain('Save');
      expect(cancelButton?.textContent).toContain('Cancel');
    });

    it('should show input fields in editing mode', () => {
      component.authors[0].editing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const inputs = compiled.querySelectorAll('input');
      expect(inputs.length).toBe(6); // 4 form inputs + 3 editing inputs (name, birthDate, nationality)
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      authorService.getAuthors.and.returnValue(of(mockAuthors));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call createAuthor when form is submitted', () => {
      component.newAuthor = { name: 'New Author', birthDate: '1990-01-01', nationality: 'American', biography: 'Test biography' };
      authorService.createAuthor.and.returnValue(of(mockAuthors[0]));
      spyOn(component, 'createAuthor');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');
      form?.dispatchEvent(new Event('ngSubmit'));
      
      expect(component.createAuthor).toHaveBeenCalled();
    });

    it('should call startEditing when edit button is clicked', () => {
      spyOn(component, 'startEditing');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const editButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Edit')) as HTMLButtonElement;
      editButton?.click();
      
      expect(component.startEditing).toHaveBeenCalledWith(component.authors[0]);
    });

    it('should call updateAuthor when save button is clicked', () => {
      component.authors[0].editing = true;
      fixture.detectChanges();
      spyOn(component, 'updateAuthor');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const saveButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Save')) as HTMLButtonElement;
      saveButton?.click();
      
      expect(component.updateAuthor).toHaveBeenCalledWith(component.authors[0]);
    });

    it('should call cancelEditing when cancel button is clicked', () => {
      component.authors[0].editing = true;
      fixture.detectChanges();
      spyOn(component, 'cancelEditing');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const cancelButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Cancel')) as HTMLButtonElement;
      cancelButton?.click();
      
      expect(component.cancelEditing).toHaveBeenCalledWith(component.authors[0]);
    });

    it('should call deleteAuthor when delete button is clicked', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component, 'deleteAuthor');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const tableButtons = compiled.querySelectorAll('tbody button');
      const deleteButton = Array.from(tableButtons).find(btn => btn.textContent?.includes('Delete')) as HTMLButtonElement;
      deleteButton?.click();
      
      expect(component.deleteAuthor).toHaveBeenCalledWith(1);
    });
  });
});
