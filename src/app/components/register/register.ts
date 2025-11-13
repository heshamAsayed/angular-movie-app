import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { from } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterPage {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    const confirm = this.form.value.confirm ?? '';

    if (password !== confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.register(email, password, this.form.value.name ?? '').subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        // توضيح نوع الخطأ حسب Firebase
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'Email already in use';
        } else if (err.code === 'auth/weak-password') {
          this.error = 'Password is too weak';
        } else {
          this.error = 'Server error, please try again';
        }
      },
    });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth.auth, provider).then((res) => res.user));
  }
}
