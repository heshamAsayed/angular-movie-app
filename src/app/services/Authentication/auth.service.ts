import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { getDatabase, ref, set, get } from '@angular/fire/database';
import { getApp } from '@angular/fire/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
} from '@angular/fire/auth'; // Import 'ref' from '@angular/fire/database'

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

  // constructor(public auth: Auth) {
  //   onAuthStateChanged(this.auth, async (user) => {
  //     if (user) {
  //       const db = getDatabase();

  //       const userRef = ref(db, `users/${user.uid}`);
  //        const snapshot = await get(userRef);

  //       const currentUser: User = snapshot.exists()
  //         ? (snapshot.val() as User)
  //         : {
  //             uid: user.uid,
  //             name: user.displayName || 'New User',
  //             email: user.email || '',
  //             phone: null,
  //             country: null,
  //             city: null,
  //             profileImage: null,
  //             watchlist: [],
  //             createdAt: Date.now(),
  //             lastLogin: Date.now(),
  //           };

  //       this._currentUser.next(currentUser);
  //       this._isAuthenticated.next(true);
  //     } else {
  //       this._currentUser.next(null);
  //       this._isAuthenticated.next(false);
  //     }
  //   });
  // }

  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const db = getDatabase();
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

        // ✅ تحديث localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        this._currentUser.next(currentUser);
        this._isAuthenticated.next(true);
      } else {
        // ✅ مسح localStorage عند الخروج
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');

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

        // ✅ خزن محليًا
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));

        this._currentUser.next(user);
        this._isAuthenticated.next(true);
        return user;
      })
    );
  }

  // --- Register ---
  // auth.service.ts
// auth.service.ts - Fixed register method

register(email: string, password: string, name: string, profileImageURL?: string): Observable<User> {
  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap((res) => {
      const user = res.user;
      if (!user) throw new Error('User creation failed');

      const newUser: User = {
        uid: user.uid,
        name: name || 'New User',
        email,
        phone: null,
        country: null,
        city: null,
        profileImage: profileImageURL || null,
        watchlist: [],
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };

      // تحديث الـ profile والـ database في نفس الوقت
      const updateProfilePromise = updateProfile(user, { 
        displayName: name, 
        photoURL: profileImageURL || null 
      }).catch(err => {
        console.warn('Profile update failed:', err);
      });

      const db = getDatabase(getApp());
      const saveToDbPromise = set(ref(db, `users/${user.uid}`), newUser);

      // ننتظر الاثنين يخلصوا
      return from(Promise.all([updateProfilePromise, saveToDbPromise]).then(() => {
        // حفظ بيانات المستخدم في localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // ✅ حفظ رابط الصورة بشكل منفصل في localStorage
        if (profileImageURL) {
          localStorage.setItem('profileImageURL', profileImageURL);
        }

        // تحديث الحالة في BehaviorSubjects
        this._currentUser.next(newUser);
        this._isAuthenticated.next(true);

        return newUser;
      }));
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

  updateProfile(updates: Partial<User>): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = this.getCurrentUser();
      if (!user) return reject(new Error('No user logged in'));

      // Merge carefully: keep all existing fields, overwrite only what's in updates
      const updatedUser: User = {
        uid: user.uid,
        name: updates.name ?? user.name,
        email: user.email, // email ثابت
        phone: updates.phone ?? user.phone,
        country: updates.country ?? user.country,
        city: updates.city ?? user.city,
        profileImage: updates.profileImage ?? user.profileImage,
        watchlist: updates.watchlist ?? user.watchlist,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      };

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update observable
      this._currentUser.next(updatedUser);

      setTimeout(() => resolve(), 500);
    });
  }
}
