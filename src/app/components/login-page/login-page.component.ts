import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    standalone: false
})
export class LoginPageComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.login(this.email, this.password);
    } catch (err: any) {
      switch (err?.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          this.error = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          this.error = 'Too many attempts. Try again later.';
          break;
        default:
          this.error = 'Login failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
