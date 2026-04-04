import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'Flip Analysis';
  currentYear = new Date().getFullYear();
  activeDropdown: string | null = null;

  constructor(public auth: AuthService) {}

  toggleDropdown(name: string): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}
