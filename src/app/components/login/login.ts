import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';
import { App } from '../../app'; // Assuming App is needed for isLoggedIn property
import { GoogleAuthProvider, getRedirectResult, signInWithRedirect ,signInWithPopup} from '@angular/fire/auth';
import { from } from 'rxjs'; // Import 'from' from 'rxjs'
import { tap } from 'rxjs/operators'; // Import 'tap' from 'rxjs/operators'
import { User } from '../../models/user.model'; // Import User model
import { getDatabase, ref, set } from 'firebase/database';
import { getApp } from 'firebase/app';
import { FacebookAuthProvider } from 'firebase/auth';
@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPage  {
  form!: FormGroup;

  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private app: App
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

ngOnInit() {
    getRedirectResult(this.auth.auth)
      .then((result) => {
        if (result?.user) {
          // تسجيل دخول ناجح
          this.app.isLoggedIn = true;
          this.router.navigate(['/movies']);
        }
      })
      .catch((error) => {
        console.error('Google login error:', error);
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

    this.auth.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/Home';
        this.router.navigate([redirectUrl]);
        sessionStorage.removeItem('redirectUrl');
        this.app.isLoggedIn = true;
      },
      error: (err) => {
        this.loading = false;
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          this.error = 'Invalid email or password';
        } else {
          this.error = 'Server error, please try again';
        }
      },
    });
  }


  
   loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    this.loading = true; // ابدأ التحميل
    this.error = ''; // امسح أي أخطاء سابقة

    from(signInWithPopup(this.auth.auth, provider).then(res => res.user))
      .pipe(
        tap((user: any | null) => {
          if (user) {
            this.app.isLoggedIn = true;
            this.router.navigate(['/movies']);
          }
        })
      ).subscribe({
        next: (user) => {
          this.loading = false; 
          console.log('Google login successful:', user);
        },
        error: (err) => {
          this.loading = false; // أوقف التحميل عند الخطأ
          console.error('Google login error:', err);
          this.error = 'Google login failed: ' + (err.message || 'Unknown error'); // اعرض الخطأ للمستخدم
        }
      });
  }


  
    // import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
  loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(this.auth.auth, provider) // auth.auth هو الـ Firebase Auth instance
      .then((result) => {
        const user = result.user;
        if (!user) throw new Error('Facebook login failed');
  
        const db = getDatabase(getApp());
        const newUser = {
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
  
        // حفظ المستخدم في DB
        set(ref(db, `users/${user.uid}`), newUser);
  
        // تحديث الحالة في AuthService
        // this.auth.setCurrentUser(newUser); // محتاج تعمل ميثود في AuthService لتحديث currentUser و isAuthenticated
  
        // حفظ في localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      })
      .catch((err) => {
        console.error('Facebook login error:', err);
        this.error = 'Facebook login failed, try again';
      });
  }
  
}
