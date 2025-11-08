import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPage {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
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

    const email = (this.form.value.email ?? '') as string;
    const password = (this.form.value.password ?? '') as string;
    const confirm = (this.form.value.confirm ?? '') as string;

    if (password !== confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    this.auth.register(email, password).subscribe({
      next: (ok) => {
        this.loading = false;
        if (ok) {
          this.router.navigate(['/login']);
        } else {
          this.error = 'Registration failed';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Server error';
      },
    });
  }
}
