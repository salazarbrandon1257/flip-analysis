import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth/auth.service';
import { ReplaySubject } from 'rxjs';

function makeMockAuthService(loggedIn: boolean) {
  return {
    isLoggedIn: loggedIn,
    user: loggedIn ? { email: 'test@example.com' } : null,
    user$: loggedIn
      ? new ReplaySubject(1)
      : new ReplaySubject(1),
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  };
}

describe('AppComponent', () => {
  function setup(loggedIn: boolean) {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
        { provide: AuthService, useValue: makeMockAuthService(loggedIn) },
      ],
    });
  }

  describe('when logged out', () => {
    beforeEach(() => setup(false));

    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it(`should have as title 'Flip Analysis'`, () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual('Flip Analysis');
    });
  });

  describe('when logged in', () => {
    beforeEach(() => setup(true));

    it('should expose auth for template binding', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.auth.isLoggedIn).toBeTrue();
    });
  });
});
