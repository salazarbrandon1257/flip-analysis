import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  User,
  setPersistence,
  indexedDBLocalPersistence,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = authState(this.auth);

  constructor() {
    setPersistence(this.auth, indexedDBLocalPersistence);
  }

  get user(): User | null {
    return this.auth.currentUser;
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/home']);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
