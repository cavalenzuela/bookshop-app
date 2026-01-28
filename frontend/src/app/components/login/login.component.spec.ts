import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty values', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.error()).toBe('');
    expect(component.isRegistering()).toBe(false);
  });

  it('should toggle between login and register mode', () => {
    expect(component.isRegistering()).toBe(false);

    component.toggleMode();
    expect(component.isRegistering()).toBe(true);
    expect(component.error()).toBe('');

    component.toggleMode();
    expect(component.isRegistering()).toBe(false);
    expect(component.error()).toBe('');
  });

  it('should show error when submitting with empty fields', () => {
    component.onSubmit();
    expect(component.error()).toBe('Por favor complete todos los campos');
  });

  it('should show error when submitting with empty username', () => {
    component.password = 'password123';
    component.onSubmit();
    expect(component.error()).toBe('Por favor complete todos los campos');
  });

  it('should show error when submitting with empty password', () => {
    component.username = 'testuser';
    component.onSubmit();
    expect(component.error()).toBe('Por favor complete todos los campos');
  });

  describe('Login functionality', () => {
    beforeEach(() => {
      component.username = 'testuser';
      component.password = 'password123';
      component.isRegistering.set(false);
    });

    it('should call authService.login with correct parameters', () => {
      authService.login.and.returnValue(of({ token: 'test-token', username: 'testuser' }));

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('should navigate to home on successful login', () => {
      authService.login.and.returnValue(of({ token: 'test-token', username: 'testuser' }));

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(component.error()).toBe('');
    });

    it('should show error message on login failure', () => {
      const errorResponse = { error: 'Invalid credentials' };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.error()).toBe('Invalid credentials');
    });

    it('should show default error message when no specific error provided', () => {
      authService.login.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.error()).toBe('Error al iniciar sesión');
    });
  });

  describe('Register functionality', () => {
    beforeEach(() => {
      component.username = 'newuser';
      component.password = 'newpassword';
      component.isRegistering.set(true);
    });

    it('should call authService.register with correct parameters', () => {
      authService.register.and.returnValue(of('User created successfully'));

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith('newuser', 'newpassword');
    });

    it('should reset form and switch to login mode on successful registration', () => {
      authService.register.and.returnValue(of('User created successfully'));

      component.onSubmit();

      expect(component.error()).toBe('');
      expect(component.isRegistering()).toBe(false);
    });

    it('should show error message on registration failure', () => {
      const errorResponse = { error: 'Username already exists' };
      authService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.error()).toBe('Username already exists');
    });

    it('should show default error message when no specific error provided', () => {
      authService.register.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.error()).toBe('Error al crear usuario');
    });
  });

  describe('Template rendering', () => {
    it('should display login title when not registering', () => {
      component.isRegistering.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Login');
    });

    it('should display register title when registering', () => {
      component.isRegistering.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Create Account');
    });

    it('should display error message when error exists', () => {
      component.error.set('Test error message');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.error-message');
      expect(errorElement?.textContent).toContain('Test error message');
    });

    it('should not display error message when no error', () => {
      component.error.set('');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.error-message');
      expect(errorElement).toBeNull();
    });

    it('should show correct button text for login mode', () => {
      component.isRegistering.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      expect(buttons[0].textContent).toContain('Login');
      expect(buttons[1].textContent).toContain('Crear Usuario');
    });

    it('should show correct button text for register mode', () => {
      component.isRegistering.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      expect(buttons[0].textContent).toContain('Crear Usuario');
      expect(buttons[1].textContent).toContain('Volver al Login');
    });
  });
});
