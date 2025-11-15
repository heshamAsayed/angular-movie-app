import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';
import { User } from '../../models/user.model'; 
import { get, getDatabase, ref, set } from 'firebase/database';
import { getApp } from 'firebase/app';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPage {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.authService.login(email, password).subscribe({
      next: async () => {
        // انتظر currentUser$ قبل navigate
        await firstValueFrom(this.authService.currentUser$.pipe(filter(u => !!u)));
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/Home';
        this.router.navigate([redirectUrl]);
        sessionStorage.removeItem('redirectUrl');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' 
          ? 'Invalid email or password' 
          : 'Server error, please try again';
      },
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    this.loading = true;
    this.error = '';

    try {
      const res = await signInWithPopup(this.authService.auth, provider);
      const user = res.user;
      if (!user) throw new Error('Google login failed');

      const db = getDatabase(getApp());
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      let newUser: User;
      if (snapshot.exists()) {
        newUser = snapshot.val() as User;
      } else {
        newUser = {
          uid: user.uid,
          name: user.displayName || 'New User',
          email: user.email || '',
          phone: user.phoneNumber || null,
          country: null,
          city: null,
          profileImage: user.photoURL || null,
          watchlist: [],
          createdAt: Date.now(),
          lastLogin: Date.now(),
        };
        await set(userRef, newUser);
      }

      this.authService.updateAuthState(newUser);

      // انتظر currentUser$
      await firstValueFrom(this.authService.currentUser$.pipe(filter(u => !!u)));
      this.router.navigate(['/movies']);
      this.loading = false;
    } catch (err: any) {
      this.loading = false;
      this.error = 'Google login failed: ' + err.message;
    }
  }

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    this.loading = true;
    this.error = '';

    try {
      const res = await signInWithPopup(this.authService.auth, provider);
      const user = res.user;
      if (!user) throw new Error('Facebook login failed');

      const db = getDatabase(getApp());
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      let newUser: User;
      if (snapshot.exists()) {
        newUser = snapshot.val() as User;
      } else {
        newUser = {
          uid: user.uid,
          name: user.displayName || 'New User',
          email: user.email || '',
          phone: user.phoneNumber || null,
          country: null,
          city: null,
          profileImage: user.photoURL || null,
          watchlist: [],
          createdAt: Date.now(),
          lastLogin: Date.now(),
        };
        await set(userRef, newUser);
      }

      this.authService.updateAuthState(newUser);

      // انتظر currentUser$
      await firstValueFrom(this.authService.currentUser$.pipe(filter(u => !!u)));
      this.router.navigate(['/movies']);
      this.loading = false;
    } catch (err: any) {
      this.loading = false;
      this.error = 'Facebook login failed: ' + err.message;
    }
  }
}