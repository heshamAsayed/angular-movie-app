import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage {
  form!: FormGroup;

  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
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
    const email = (this.form.value.email ?? '') as string;
    const password = (this.form.value.password ?? '') as string;
    this.auth.login(email, password).subscribe({
      next: (ok) => {
        this.loading = false;
        if (ok) {
          this.router.navigate(['/movies']);
        } else {
          this.error = 'Invalid credentials';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Server error';
      },
    });
  }
}
