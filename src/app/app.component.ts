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

  constructor(public auth: AuthService) {}

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}
