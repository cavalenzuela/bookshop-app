import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');
    expect(title?.textContent).toContain('Categories Management');
  });

  it('should have router outlet for child components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have correct container styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.max-w-2xl');
    expect(container).toBeTruthy();
    expect(container?.classList.contains('mx-auto')).toBe(true);
    expect(container?.classList.contains('mt-8')).toBe(true);
    expect(container?.classList.contains('p-6')).toBe(true);
    expect(container?.classList.contains('bg-dark-card')).toBe(true);
    expect(container?.classList.contains('rounded-lg')).toBe(true);
    expect(container?.classList.contains('shadow-lg')).toBe(true);
    expect(container?.classList.contains('border')).toBe(true);
    expect(container?.classList.contains('border-dark-border')).toBe(true);
  });

  it('should have correct title styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');
    expect(title?.classList.contains('text-2xl')).toBe(true);
    expect(title?.classList.contains('font-bold')).toBe(true);
    expect(title?.classList.contains('mb-6')).toBe(true);
    expect(title?.classList.contains('text-white')).toBe(true);
  });
});
