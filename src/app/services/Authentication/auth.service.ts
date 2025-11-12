import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(
    !!localStorage.getItem('isLoggedIn')
  );
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _currentUser = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$ = this._currentUser.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  private _error = new BehaviorSubject<string | null>(null);
  public error$ = this._error.asObservable();

  constructor() {}

  // --- Check login status ---
  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  // --- Get current user ---
  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // --- Login ---
  login(email: string, password: string): Observable<boolean> {
    const success = !!email && !!password;
    return of(success).pipe(
      delay(500),
      tap(ok => {
        this._isAuthenticated.next(ok);
        if (ok) {
          localStorage.setItem('isLoggedIn', 'true');
          const user: User = { email, name: 'Demo User', password } as any;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._currentUser.next(user);
        }
      })
    );
  }

  // --- Register ---
  register(email: string, password: string): Observable<boolean> {
    const success = !!email && !!password;
    return of(success).pipe(
      delay(600),
      tap(ok => {
        this._isAuthenticated.next(ok);
        if (ok) {
          localStorage.setItem('isLoggedIn', 'true');
          const user: User = { email, name: 'New User', password } as any;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._currentUser.next(user);
        }
      })
    );
  }

  // --- Logout ---
  logout(): Promise<void> {
    return new Promise(resolve => {
      this._isAuthenticated.next(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      this._currentUser.next(null);
      resolve();
    });
  }

  // --- Update password ---
  updatePassword(newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!newPassword || newPassword.length < 6) {
        reject(new Error('Password must be at least 6 characters'));
        return;
      }

      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (user) {
        user.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this._currentUser.next(user);
      }

      setTimeout(() => resolve(), 500); // simulate async
    });
  }

  // --- Reset password (simulate email) ---
  resetPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!email) return reject(new Error('Email is required'));
      console.log(`Password reset email sent to ${email}`);
      setTimeout(() => resolve(), 1000);
    });
  }

  // --- Update profile ---
  updateProfile(updates: Partial<User>): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = this.getCurrentUser();
      if (!user) return reject(new Error('No user logged in'));
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this._currentUser.next(updatedUser);
      setTimeout(() => resolve(), 500);
    });
  }
}
