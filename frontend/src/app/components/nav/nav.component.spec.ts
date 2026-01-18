import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NavComponent } from './nav.component';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn', 'getUsername']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), 
        NavComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.nav-title');
    expect(title?.textContent).toContain('Book Shop');
  });

  it('should have correct router link for title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleLink = compiled.querySelector('.nav-title');
    expect(titleLink?.getAttribute('routerLink')).toBe('/home');
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUsername.and.returnValue('testuser');
      fixture.detectChanges();
    });

    it('should display navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelector('.nav-links');
      expect(navLinks).toBeTruthy();
    });

    it('should display all navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.nav-links a[routerLink]');
      expect(links.length).toBe(3);
      
      const hrefs = Array.from(links).map(link => link.getAttribute('routerLink'));
      expect(hrefs).toContain('/books');
      expect(hrefs).toContain('/authors');
      expect(hrefs).toContain('/categories');
    });

    it('should display username', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const username = compiled.querySelector('.username');
      expect(username?.textContent).toContain('testuser');
    });

    it('should display logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector('button');
      expect(logoutButton?.textContent).toContain('Logout');
    });

    it('should call authService.getUsername', () => {
      expect(authService.getUsername).toHaveBeenCalled();
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should not display navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelector('.nav-links');
      expect(navLinks).toBeNull();
    });

    it('should not display username', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const username = compiled.querySelector('.username');
      expect(username).toBeNull();
    });

    it('should not display logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector('button');
      expect(logoutButton).toBeNull();
    });
  });

  describe('logout functionality', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUsername.and.returnValue('testuser');
      fixture.detectChanges();
    });

    it('should call authService.logout when logout button is clicked', () => {
      authService.logout.and.returnValue(of('Logged out successfully'));
      
      component.logout();
      
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to login on successful logout', () => {
      authService.logout.and.returnValue(of('Logged out successfully'));
      spyOn(router, 'navigate');
      
      component.logout();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to login even if logout fails', () => {
      authService.logout.and.returnValue(throwError(() => new Error('Logout failed')));
      spyOn(router, 'navigate');
      
      component.logout();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle logout button click in template', () => {
      authService.logout.and.returnValue(of('Logged out successfully'));
      spyOn(router, 'navigate');
      
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector('button');
      logoutButton?.click();
      
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('styling and classes', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUsername.and.returnValue('testuser');
      fixture.detectChanges();
    });

    it('should have correct nav structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('nav');
      expect(nav?.classList.contains('bg-dark-surface')).toBe(true);
      expect(nav?.classList.contains('border-b')).toBe(true);
      expect(nav?.classList.contains('border-dark-border')).toBe(true);
    });

    it('should have correct nav content structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navContent = compiled.querySelector('.nav-content');
      expect(navContent).toBeTruthy();
    });

    it('should have correct nav left structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLeft = compiled.querySelector('.nav-left');
      expect(navLeft).toBeTruthy();
    });

    it('should have correct nav actions structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navActions = compiled.querySelector('.nav-actions');
      expect(navActions).toBeTruthy();
    });
  });
});
