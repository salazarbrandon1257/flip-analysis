import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take, timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  try {
    // Check if a user exists — authState will emit immediately if
    // a session is already restored from IndexedDB, or after a delay.
    const user = await firstValueFrom(
      authState(auth).pipe(take(1), timeout(3000))
    );
    if (user) {
      return true;
    }
  } catch {
    // timeout means no user yet — fall through to redirect
  }

  return router.parseUrl('/login');
};
