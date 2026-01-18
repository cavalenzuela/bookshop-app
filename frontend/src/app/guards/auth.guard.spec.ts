import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true when user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBe(true);
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    router.navigate.and.returnValue(Promise.resolve(true));

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(jasmine.any(Promise));
  });

  it('should handle navigation promise rejection', () => {
    authService.isLoggedIn.and.returnValue(false);
    router.navigate.and.returnValue(Promise.reject('Navigation failed'));

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(jasmine.any(Promise));
  });

  it('should be a function', () => {
    expect(typeof authGuard).toBe('function');
  });

  it('should call isLoggedIn only once', () => {
    authService.isLoggedIn.and.returnValue(true);

    TestBed.runInInjectionContext(() => authGuard());

    expect(authService.isLoggedIn).toHaveBeenCalledTimes(1);
  });

  it('should call navigate only when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.runInInjectionContext(() => authGuard());

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not call navigate when user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    TestBed.runInInjectionContext(() => authGuard());

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
