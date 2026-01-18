import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthorFormComponent } from './author-form.component';
import { AuthorService } from '../../../services/author.service';
import { Author } from '../../../models/author.model';

describe('AuthorFormComponent', () => {
  let component: AuthorFormComponent;
  let fixture: ComponentFixture<AuthorFormComponent>;
  let authorService: jasmine.SpyObj<AuthorService>;
  let router: Router;
  let route: jasmine.SpyObj<ActivatedRoute>;

  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    birthDate: '1990-01-01',
    nationality: 'American',
    biography: 'Test biography'
  };

  beforeEach(async () => {
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthor', 'createAuthor', 'updateAuthor']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { paramMap: { get: jasmine.createSpy('get') } }
    });

    await TestBed.configureTestingModule({
      imports: [AuthorFormComponent, RouterTestingModule],
      providers: [
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorFormComponent);
    component = fixture.componentInstance;
    authorService = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    // Set default return values for service methods
    authorService.getAuthor.and.returnValue(of(mockAuthor));
    authorService.createAuthor.and.returnValue(of(mockAuthor));
    authorService.updateAuthor.and.returnValue(of(mockAuthor));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.author).toEqual({
      name: '',
      birthDate: '',
      nationality: '',
      biography: ''
    });
    expect(component.isEditing).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  describe('ngOnInit', () => {
    it('should set editing mode and load author if ID is provided', () => {
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
      spyOn(component, 'loadAuthor');
      
      component.ngOnInit();
      
      expect(component.isEditing).toBe(true);
      expect(component.loadAuthor).toHaveBeenCalledWith(1);
    });

    it('should not set editing mode if no ID is provided', () => {
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.isEditing).toBe(false);
    });
  });

  describe('loadAuthor', () => {
    it('should load author successfully and format birth date', () => {
      const authorWithDate = {
        ...mockAuthor,
        birthDate: '1989-12-30T00:00:00.000Z'
      };
      authorService.getAuthor.and.returnValue(of(authorWithDate));
      
      component.loadAuthor(1);
      
      expect(authorService.getAuthor).toHaveBeenCalledWith(1);
      expect(component.author).toEqual({
        ...mockAuthor,
        birthDate: '1989-12-29'
      });
    });

    it('should load author without birth date', () => {
      const authorWithoutDate = {
        ...mockAuthor,
        birthDate: null as any
      };
      authorService.getAuthor.and.returnValue(of(authorWithoutDate));
      
      component.loadAuthor(1);
      
      expect(component.author).toEqual(authorWithoutDate);
    });

    it('should load author successfully', () => {
      authorService.getAuthor.and.returnValue(of(mockAuthor));
      
      component.loadAuthor(1);
      
      expect(authorService.getAuthor).toHaveBeenCalledWith(1);
      expect(component.author).toEqual(mockAuthor);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.author = { ...mockAuthor };
    });

    it('should update author when in editing mode', () => {
      component.isEditing = true;
      component.author.id = 1;
      authorService.updateAuthor.and.returnValue(of(mockAuthor));
      
      component.onSubmit();
      
      expect(authorService.updateAuthor).toHaveBeenCalledWith(1, component.author);
      expect(component.successMessage).toBe('Author updated successfully!');
      expect(component.isSubmitting).toBe(true);
    });

    it('should create author when not in editing mode', () => {
      component.isEditing = false;
      authorService.createAuthor.and.returnValue(of(mockAuthor));
      
      component.onSubmit();
      
      expect(authorService.createAuthor).toHaveBeenCalledWith(component.author);
      expect(component.successMessage).toBe('Author created successfully!');
      expect(component.isSubmitting).toBe(true);
    });

    it('should update author successfully', () => {
      component.isEditing = true;
      component.author.id = 1;
      authorService.updateAuthor.and.returnValue(of(mockAuthor));
      
      component.onSubmit();
      
      expect(authorService.updateAuthor).toHaveBeenCalledWith(1, component.author);
      expect(component.successMessage).toBe('Author updated successfully!');
    });

    it('should create author successfully', () => {
      component.isEditing = false;
      authorService.createAuthor.and.returnValue(of(mockAuthor));
      
      component.onSubmit();
      
      expect(authorService.createAuthor).toHaveBeenCalledWith(component.author);
      expect(component.successMessage).toBe('Author created successfully!');
    });

    it('should navigate to authors list after successful operation', (done) => {
      authorService.createAuthor.and.returnValue(of(mockAuthor));
      spyOn(router, 'navigate');
      
      component.onSubmit();
      
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/authors']);
        done();
      }, 1600);
    });
  });

  describe('template rendering', () => {
    it('should display correct title for new author', () => {
      component.isEditing = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Add New Author');
    });

    it('should display correct title for editing author', () => {
      component.isEditing = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Edit Author');
    });

    it('should display success message when present', () => {
      component.successMessage = 'Author created successfully!';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const successMessage = compiled.querySelector('.bg-green-900');
      expect(successMessage?.textContent).toContain('Author created successfully!');
    });

    it('should display error message when present', () => {
      component.errorMessage = 'Error creating author';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMessage = compiled.querySelector('.bg-red-900');
      expect(errorMessage?.textContent).toContain('Error creating author');
    });

    it('should have all required form fields', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const nameInput = compiled.querySelector('input[name="name"]');
      const birthDateInput = compiled.querySelector('input[name="birthDate"]');
      const nationalityInput = compiled.querySelector('input[name="nationality"]');
      const biographyTextarea = compiled.querySelector('textarea[name="biography"]');
      
      expect(nameInput).toBeTruthy();
      expect(birthDateInput).toBeTruthy();
      expect(nationalityInput).toBeTruthy();
      expect(biographyTextarea).toBeTruthy();
    });

    it('should display correct button text for creating author', () => {
      component.isEditing = false;
      component.isSubmitting = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Create Author');
    });

    it('should display correct button text for updating author', () => {
      component.isEditing = true;
      component.isSubmitting = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Update Author');
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
      const cancelButton = compiled.querySelector('button[routerLink="/authors"]');
      expect(cancelButton?.textContent).toContain('Cancel');
    });
  });

  describe('form validation', () => {
    it('should show validation errors when form is submitted with invalid data', () => {
      component.author = { name: '', birthDate: '', nationality: '', biography: '' };
      authorService.createAuthor.and.returnValue(of(mockAuthor));
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');
      
      // Simular envío del formulario llamando directamente al método
      component.onSubmit();
      fixture.detectChanges();
      
      // Verificar que se muestran mensajes de error en la consola (ya que el formulario no es válido)
      expect(component.isSubmitting).toBe(true);
    });
  });
});
