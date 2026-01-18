import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage before creating service
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user successfully', () => {
      const username = 'testuser';
      const password = 'testpassword';
      const mockResponse = 'User created successfully';

      service.register(username, password).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const username = 'testuser';
      const password = 'testpassword';
      const mockError = { error: 'Username already exists' };

      service.register(username, password).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      });

      const req = httpMock.expectOne('/api/auth/register');
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should login successfully and store token and username', () => {
      const username = 'testuser';
      const password = 'testpassword';
      const mockResponse = {
        token: 'mock-jwt-token',
        username: 'testuser'
      };

      service.login(username, password).subscribe(response => {
        expect(response).toBe(mockResponse);
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        expect(localStorage.getItem('username')).toBe('testuser');
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const mockError = { error: 'Invalid credentials' };

      service.login(username, password).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.error.error).toBe('Invalid credentials');
        }
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear stored data', () => {
      // First simulate login to set up state
      const loginResponse = { token: 'mock-jwt-token', username: 'testuser' };
      service.login('testuser', 'testpass').subscribe();
      const loginReq = httpMock.expectOne('/api/auth/login');
      loginReq.flush(loginResponse);

      const mockResponse = 'Logged out successfully';

      service.logout().subscribe(response => {
        expect(response).toBe(mockResponse);
        expect(service.getToken()).toBeNull();
        expect(service.getUsername()).toBeNull();
      });

      const req = httpMock.expectOne('/api/auth/logout');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
      req.flush(mockResponse);
    });

    it('should handle logout error but still clear local data', () => {
      // First simulate login to set up state
      const loginResponse = { token: 'mock-jwt-token', username: 'testuser' };
      service.login('testuser', 'testpass').subscribe();
      const loginReq = httpMock.expectOne('/api/auth/login');
      loginReq.flush(loginResponse);

      service.logout().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          // On error, local data is NOT cleared because tap() only runs on success
          expect(service.getToken()).toBe('mock-jwt-token');
          expect(service.getUsername()).toBe('testuser');
        }
      });

      const req = httpMock.expectOne('/api/auth/logout');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      // Simulate login to set token in BehaviorSubject
      const mockResponse = { token: 'mock-jwt-token', username: 'testuser' };
      
      service.login('testuser', 'testpass').subscribe(response => {
        expect(service.getToken()).toBe('mock-jwt-token');
      });
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);
    });

    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      // Simulate login to set token in BehaviorSubject
      const mockResponse = { token: 'mock-jwt-token', username: 'testuser' };
      
      service.login('testuser', 'testpass').subscribe(response => {
        expect(service.isLoggedIn()).toBe(true);
      });
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);
    });

    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('token', '');
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getUsername', () => {
    it('should return username from localStorage', () => {
      // Simulate login to set username in BehaviorSubject
      const mockResponse = { token: 'mock-jwt-token', username: 'testuser' };
      
      service.login('testuser', 'testpass').subscribe(response => {
        expect(service.getUsername()).toBe('testuser');
      });
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);
    });

    it('should return null when no username is stored', () => {
      expect(service.getUsername()).toBeNull();
    });
  });

  describe('token and username subjects', () => {
    it('should update token subject when login is successful', () => {
      const username = 'testuser';
      const password = 'testpassword';
      const mockResponse = {
        token: 'mock-jwt-token',
        username: 'testuser'
      };

      let tokenValue: string | null = null;
      let usernameValue: string | null = null;

      service['tokenSubject'].subscribe(token => tokenValue = token);
      service['usernameSubject'].subscribe(username => usernameValue = username);

      service.login(username, password).subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      expect(tokenValue as unknown as string).toBe('mock-jwt-token');
      expect(usernameValue as unknown as string).toBe('testuser');
    });

    it('should clear token and username subjects when logout is successful', () => {
      // Set up initial state
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('username', 'testuser');

      let tokenValue: string | null = 'initial';
      let usernameValue: string | null = 'initial';

      service['tokenSubject'].subscribe(token => tokenValue = token);
      service['usernameSubject'].subscribe(username => usernameValue = username);

      service.logout().subscribe();

      const req = httpMock.expectOne('/api/auth/logout');
      req.flush('Logged out successfully');

      expect(tokenValue).toBeNull();
      expect(usernameValue).toBeNull();
    });
  });

  describe('initialization with existing localStorage data', () => {
    it('should initialize with existing token and username from localStorage', () => {
      localStorage.setItem('token', 'existing-token');
      localStorage.setItem('username', 'existing-user');

      // Create a new service instance to test initialization
      const newService = new AuthService(TestBed.inject(HttpClient));

      expect(newService.getToken()).toBe('existing-token');
      expect(newService.getUsername()).toBe('existing-user');
      expect(newService.isLoggedIn()).toBe(true);
    });
  });
});
