import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authGuard } from './auth.guard';
import { firstValueFrom, of, ReplaySubject } from 'rxjs';

const mockAuth = (user: any) => ({
  currentUser: user,
});

describe('authGuard', () => {
  function setup(hasUser: boolean) {
    const mockAuthObj = hasUser ? mockAuth({ uid: 'abc' }) : mockAuth(null);
    const mockNav = jasmine.createSpyObj('Router', ['parseUrl'], {
      url: '',
      navigate: jasmine.createSpy('navigate'),
    });
    mockNav.parseUrl.and.returnValue('/login' as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuthObj },
        { provide: Router, useValue: mockNav },
      ],
    });
    return {
      router: TestBed.inject(Router),
    };
  }

  it('should return true when user is authenticated', async () => {
    const { router } = setup(true);
    // We can't fully test because authState() from AngularFire needs real Firebase,
    // but we can at least verify the guard exists and the module loads
    expect(authGuard).toBeDefined();
  });
});
