import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const welcomeMessage = compiled.querySelector('h1');
    expect(welcomeMessage?.textContent).toContain('Welcome to Book Shop');
  });

  it('should display description text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('p');
    expect(description?.textContent).toContain('Manage your books and authors with ease');
  });

  it('should have three main sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('.bg-dark-card');
    expect(sections.length).toBe(3);
  });

  it('should have Books section with correct content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const booksSection = compiled.querySelector('.bg-dark-card:nth-child(1)');
    expect(booksSection?.textContent).toContain('Books');
    expect(booksSection?.textContent).toContain('Manage your book collection');
  });

  it('should have Authors section with correct content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const authorsSection = compiled.querySelector('.bg-dark-card:nth-child(2)');
    expect(authorsSection?.textContent).toContain('Authors');
    expect(authorsSection?.textContent).toContain('Manage your authors');
  });

  it('should have Categories section with correct content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const categoriesSection = compiled.querySelector('.bg-dark-card:nth-child(3)');
    expect(categoriesSection?.textContent).toContain('Categories');
    expect(categoriesSection?.textContent).toContain('Manage your book categories');
  });

  it('should have correct router links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a[routerLink]');
    expect(links.length).toBe(3);
    
    const hrefs = Array.from(links).map(link => link.getAttribute('routerLink'));
    expect(hrefs).toContain('/books');
    expect(hrefs).toContain('/authors');
    expect(hrefs).toContain('/categories');
  });

  it('should have proper button styling classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('a[routerLink]');
    
    buttons.forEach(button => {
      expect(button.classList.contains('inline-block')).toBe(true);
      expect(button.classList.contains('text-white')).toBe(true);
      expect(button.classList.contains('px-6')).toBe(true);
      expect(button.classList.contains('py-2')).toBe(true);
      expect(button.classList.contains('rounded-lg')).toBe(true);
    });
  });
});
