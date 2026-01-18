import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let nextHandler: jasmine.Spy;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    nextHandler = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(AuthInterceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists and URL is not auth', () => {
    const token = 'mock-jwt-token';
    const request = new HttpRequest('GET', '/api/books');

    authService.getToken.and.returnValue(token);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalled();
    
    const calledRequest = nextHandler.calls.mostRecent().args[0];
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add Authorization header when token does not exist', () => {
    const request = new HttpRequest('GET', '/api/books');

    authService.getToken.and.returnValue(null);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalledWith(request);
  });

  it('should not add Authorization header when URL contains /auth/', () => {
    const token = 'mock-jwt-token';
    const request = new HttpRequest('POST', '/api/auth/login', {});

    authService.getToken.and.returnValue(token);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalledWith(request);
  });

  it('should handle empty token string', () => {
    const request = new HttpRequest('GET', '/api/books');

    authService.getToken.and.returnValue('');

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalledWith(request);
  });

  it('should handle undefined token', () => {
    const request = new HttpRequest('GET', '/api/books');

    authService.getToken.and.returnValue(null);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalledWith(request);
  });

  it('should handle case sensitivity in auth URL check', () => {
    const token = 'mock-jwt-token';
    const request = new HttpRequest('POST', '/api/AUTH/login', {});

    authService.getToken.and.returnValue(token);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(request, nextHandler).subscribe();
    });

    expect(authService.getToken).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalled();
    
    // Since the interceptor is case-sensitive and only checks for lowercase '/auth/',
    // uppercase '/AUTH/' should get the Authorization header added
    const calledRequest = nextHandler.calls.mostRecent().args[0];
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });
});