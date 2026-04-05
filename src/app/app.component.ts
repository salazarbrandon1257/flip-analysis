import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './services/theme.service';

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

  constructor(
    public auth: AuthService,
    public themeService: ThemeService
  ) {}

  toggleDropdown(name: string): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}
