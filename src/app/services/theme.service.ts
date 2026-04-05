import { Injectable } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: Theme;

  constructor() {
    this.currentTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    this.applyTheme(this.currentTheme);
  }

  get theme(): Theme {
    return this.currentTheme;
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
