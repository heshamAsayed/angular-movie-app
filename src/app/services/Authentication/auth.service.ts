// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { User } from '../../models/user.model';
// import { getDatabase, ref, set, get, update } from '@angular/fire/database';
// import { getApp } from '@angular/fire/app';
// import {
//   Auth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signOut,
//   onAuthStateChanged,
// } from '@angular/fire/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private _loading = new BehaviorSubject<boolean>(false);
//   public loading$ = this._loading.asObservable();

//   private _error = new BehaviorSubject<string | null>(null);
//   public error$ = this._error.asObservable();

//   private _isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('isLoggedIn'));
//   public isAuthenticated$ = this._isAuthenticated.asObservable();

//   private _currentUser = new BehaviorSubject<User | null>(
//     JSON.parse(localStorage.getItem('currentUser') || 'null')
//   );
//   public currentUser$ = this._currentUser.asObservable();

//   constructor(public auth: Auth) {
//     onAuthStateChanged(this.auth, async (user) => {
//       if (user) {
//         const db = getDatabase();
//         const userRef = ref(db, `users/${user.uid}`);
//         const snapshot = await get(userRef);

//         let currentUser: User;
//         if (snapshot.exists()) {
//           currentUser = snapshot.val() as User;
//           // Check if complete, if not, fill defaults
//           currentUser = {
//             uid: user.uid,
//             name: currentUser.name || user.displayName || 'New User',
//             email: currentUser.email || user.email || '',
//             phone: currentUser.phone || null,
//             country: currentUser.country || null,
//             city: currentUser.city || null,
//             profileImage: currentUser.profileImage || user.photoURL || null,
//             watchlist: currentUser.watchlist || [],
//             createdAt: currentUser.createdAt || Date.now(),
//             lastLogin: Date.now(), // Always update lastLogin
//           };
//           await set(userRef, currentUser); // Update DB if needed
//         } else {
//           // Create new complete User
//           currentUser = {
//             uid: user.uid,
//             name: user.displayName || 'New User',
//             email: user.email || '',
//             phone: null,
//             country: null,
//             city: null,
//             profileImage: user.photoURL || null,
//             watchlist: [],
//             createdAt: Date.now(),
//             lastLogin: Date.now(),
//           };
//           await set(userRef, currentUser);
//         }

//         this.saveCurrentUser(currentUser); // Use new method
//         this._currentUser.next(currentUser);
//         this._isAuthenticated.next(true);
//       } else {
//         localStorage.removeItem('isLoggedIn');
//         localStorage.removeItem('currentUser');

//         this._currentUser.next(null);
//         this._isAuthenticated.next(false);
//       }
//     });
//   }

//   saveCurrentUser(user: User): void {
//     localStorage.setItem('isLoggedIn', 'true');
//     localStorage.setItem('currentUser', JSON.stringify(user));
//   }

//   // --- Login ---
//   login(email: string, password: string): Observable<User> {
//     return from(
//       signInWithEmailAndPassword(this.auth, email, password).then((res) => {
//         const user: User = {
//           uid: res.user.uid,
//           name: res.user.displayName || 'New User',
//           email: res.user.email || '',
//           phone: null,
//           country: null,
//           city: null,
//           profileImage: res.user.photoURL || null,
//           watchlist: [],
//           createdAt: Date.now(),
//           lastLogin: Date.now(),
//         };

//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('currentUser', JSON.stringify(user));

//         this._currentUser.next(user);
//         this._isAuthenticated.next(true);
//         return user;
//       })
//     );
//   }

//   // --- Register مع دعم الصورة ---
//   register(email: string, password: string, name: string, profileImageURL?: string): Observable<User> {
//     return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
//       switchMap((res) => {
//         const user = res.user;
//         if (!user) throw new Error('User creation failed');

//         const newUser: User = {
//           uid: user.uid,
//           name: name || 'New User',
//           email,
//           phone: null,
//           country: null,
//           city: null,
//           profileImage: profileImageURL || null,
//           watchlist: [],
//           createdAt: Date.now(),
//           lastLogin: Date.now(),
//         };

//         const updateProfilePromise = updateProfile(user, {
//           displayName: name,
//           photoURL: profileImageURL || null,
//         }).catch(err => console.warn('Profile update failed:', err));

//         const db = getDatabase(getApp());
//         const saveToDbPromise = set(ref(db, `users/${user.uid}`), newUser);

//         return from(Promise.all([updateProfilePromise, saveToDbPromise]).then(() => {
//           localStorage.setItem('isLoggedIn', 'true');
//           localStorage.setItem('currentUser', JSON.stringify(newUser));

//           this._currentUser.next(newUser);
//           this._isAuthenticated.next(true);

//           return newUser;
//         }));
//       })
//     );
//   }

//   // --- Logout ---
//   logout(): Observable<void> {
//     return from(
//       signOut(this.auth).then(() => {
//         this._isAuthenticated.next(false);
//         this._currentUser.next(null);
//         localStorage.removeItem('isLoggedIn');
//         localStorage.removeItem('currentUser');
//       })
//     );
//   }

//   // --- Update password ---
//   updatePassword(newPassword: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (!newPassword || newPassword.length < 6) {
//         reject(new Error('Password must be at least 6 characters'));
//         return;
//       }

//       const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
//       if (user) {
//         user.password = newPassword;
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         this._currentUser.next(user);
//       }

//       setTimeout(() => resolve(), 500);
//     });
//   }

//   // --- Reset password ---
//   resetPassword(email: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (!email) return reject(new Error('Email is required'));
//       console.log(`Password reset email sent to ${email}`);
//       setTimeout(() => resolve(), 1000);
//     });
//   }

//   // --- Update profile ---
//   updateProfile(updates: Partial<User>): Promise<void> {
//     return new Promise(async (resolve, reject) => {
//       const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
//       if (!storedUser || !storedUser.uid) return reject(new Error('No user logged in'));

//       const updatedUser: User = { ...storedUser, ...updates };

//       // Update in DB
//       const db = getDatabase(getApp());
//       const userRef = ref(db, `users/${storedUser.uid}`);
//       try {
//         await update(userRef, updates); // Use update for partial updates (better for watchlist)
//       } catch (err) {
//         return reject(new Error('Failed to update in DB: ' + (err as Error).message));
//       }

//       // Update localStorage and subject
//       this.saveCurrentUser(updatedUser);
//       this._currentUser.next(updatedUser);

//       setTimeout(() => resolve(), 500); // Keep the delay if needed
//     });
//   }

//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('isLoggedIn');
//   }

//   getCurrentUser(): User | null {
//     return JSON.parse(localStorage.getItem('currentUser') || 'null');
//   }

//   // Method جديدة لتحديث state مباشرة (للـ social)
//   updateAuthState(user: User): void {
//     this.saveCurrentUser(user);
//     this._currentUser.next(user);
//     this._isAuthenticated.next(true);
//   }
// }


// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { getDatabase, ref, set, get, update } from '@angular/fire/database';
import { getApp } from '@angular/fire/app';
import { firstValueFrom } from 'rxjs';
import { filter, take, finalize } from 'rxjs/operators';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword, // <-- مهم
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  private _error = new BehaviorSubject<string | null>(null);
  public error$ = this._error.asObservable();

  private _isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('isLoggedIn'));
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _currentUser = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$ = this._currentUser.asObservable();

  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        let currentUser: User;
        if (snapshot.exists()) {
          currentUser = snapshot.val() as User;
          currentUser = {
            uid: firebaseUser.uid,
            name: currentUser.name || firebaseUser.displayName || 'New User',
            email: currentUser.email || firebaseUser.email || '',
            phone: currentUser.phone ?? null,
            country: currentUser.country ?? null,
            city: currentUser.city ?? null,
            profileImage: currentUser.profileImage ?? firebaseUser.photoURL ?? null,
            watchlist: Array.isArray(currentUser.watchlist) ? currentUser.watchlist : [],
            createdAt: currentUser.createdAt ?? Date.now(),
            lastLogin: Date.now(),
          };
          await set(userRef, currentUser);
        } else {
          currentUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            phone: null,
            country: null,
            city: null,
            profileImage: firebaseUser.photoURL || null,
            watchlist: [],
            createdAt: Date.now(),
            lastLogin: Date.now(),
          };
          await set(userRef, currentUser);
        }

        this.saveCurrentUser(currentUser);
        this._currentUser.next(currentUser);
        this._isAuthenticated.next(true);
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        this._currentUser.next(null);
        this._isAuthenticated.next(false);
      }
    });
  }

  private saveCurrentUser(user: User): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // --- Login ---
  login(email: string, password: string): Observable<User> {
  this._loading.next(true);
  return from(
    signInWithEmailAndPassword(this.auth, email, password).then(() => {
      // انتظر حتى يحدث onAuthStateChanged
      return firstValueFrom(
        this.currentUser$.pipe(
          filter(u => u !== null),
          take(1)
        )
      );
    })
  ).pipe(finalize(() => this._loading.next(false)));
}

  // --- Register ---
  register(email: string, password: string, name: string, profileImageURL?: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (res) => {
        const firebaseUser = res.user;
        if (!firebaseUser) throw new Error('User creation failed');

        const newUser: User = {
          uid: firebaseUser.uid,
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

        await updateProfile(firebaseUser, { displayName: name, photoURL: profileImageURL || null }).catch(() => {});

        const db = getDatabase(getApp());
        await set(ref(db, `users/${firebaseUser.uid}`), newUser);

        this.saveCurrentUser(newUser);
        this._currentUser.next(newUser);
        this._isAuthenticated.next(true);

        return newUser;
      })
    );
  }

  // --- Logout ---
  logout(): Observable<void> {
    return from(signOut(this.auth).then(() => {
      this._isAuthenticated.next(false);
      this._currentUser.next(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    }));
  }

  // --- Update Password (Firebase Auth) ---
  updatePassword(newPassword: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      return Promise.reject(new Error('No user logged in'));
    }
    return firebaseUpdatePassword(firebaseUser, newPassword);
  }

  // --- Reset Password (Send Email) ---
  resetPassword(email: string): Promise<void> {
    if (!email) return Promise.reject(new Error('Email is required'));
    return sendPasswordResetEmail(this.auth, email);
  }

  // --- Update Profile (DB + local) ---
  updateProfile(updates: Partial<User>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const storedUser = this.getCurrentUser();
      if (!storedUser || !storedUser.uid) {
        return reject(new Error('No user logged in'));
      }

      const updatedUser: User = { ...storedUser, ...updates };

      const db = getDatabase(getApp());
      const userRef = ref(db, `users/${storedUser.uid}`);

      try {
        await update(userRef, updates);
      } catch (err: any) {
        return reject(new Error('Failed to update DB: ' + err.message));
      }

      this.saveCurrentUser(updatedUser);
      this._currentUser.next(updatedUser);
      resolve();
    });
  }

  // --- Get Current User ---
  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  // --- Social Login Helper ---
  updateAuthState(user: User): void {
    this.saveCurrentUser(user);
    this._currentUser.next(user);
    this._isAuthenticated.next(true);
  }
}