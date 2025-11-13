import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { getDatabase, ref, set ,get } from '@angular/fire/database';
import { getApp } from '@angular/fire/app';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getAuth, // Changed 'get' to 'getAuth'
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('isLoggedIn'));
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _currentUser = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$ = this._currentUser.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  private _error = new BehaviorSubject<string | null>(null);
  public error$ = this._error.asObservable();

  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const db = getDatabase(getApp());
        const userRef = ref(db, `users/${user.uid}`);
         const snapshot = await get(userRef);
        
        const currentUser: User = snapshot.exists()
          ? (snapshot.val() as User)
          : {
              uid: user.uid,
              name: user.displayName || 'New User',
              email: user.email || '',
              phone: null,
              country: null,
              city: null,
              profileImage: null,
              watchlist: [],
              createdAt: Date.now(),
              lastLogin: Date.now(),
            };

        this._currentUser.next(currentUser);
        this._isAuthenticated.next(true);
      } else {
        this._currentUser.next(null);
        this._isAuthenticated.next(false);
      }
    });
  }

  // --- Check login status ---
  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  // --- Get current user ---
  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // --- Login ---
  login(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then((res) => {
        const user: User = {
          uid: res.user.uid,
          name: res.user.displayName || 'New User',
          email: res.user.email || '',
          phone: null,
          country: null,
          city: null,
          profileImage: null,
          watchlist: [],
          createdAt: Date.now(),
          lastLogin: Date.now(),
        };
        this._currentUser.next(user);
        this._isAuthenticated.next(true);
        return user;
      })
    );
  }

  // --- Register ---
  register(email: string, password: string, name: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (res) => {
        const user = res.user;

        if (!user) throw new Error('User creation failed');

        // تحديث الاسم في Firebase Auth
        await updateProfile(user, { displayName: name });

        // Firestore instance
        // const db = getDatabase();
        const db = getDatabase(getApp());

        // إعداد بيانات المستخدم للحفظ
        const newUser: User = {
          uid: user.uid,
          name: name || 'New User',
          email: email,
          phone: null,
          country: null,
          city: null,
          profileImage: null,
          watchlist: [], // مهم لتحديث count
          createdAt: Date.now(),
          lastLogin: Date.now(),
        };

        // حفظ المستخدم في Firestore
       await set(ref(db, `users/${user.uid}`), newUser);
        // تحديث الـ BehaviorSubject
        this._currentUser.next(newUser);
        this._isAuthenticated.next(true);

        return newUser;
      })
    );
  }

  // --- Logout ---
  logout(): Observable<void> {
    return from(
      signOut(this.auth).then(() => {
        this._isAuthenticated.next(false);
        this._currentUser.next(null);
      })
    );
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
