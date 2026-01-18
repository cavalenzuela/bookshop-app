import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="min-h-screen bg-dark-bg text-dark-text">
      <app-nav></app-nav>
      <main class="px-4 py-6 max-w-7xl mx-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #1a1a1a;
    }
  `]
})
export class AppComponent {}
