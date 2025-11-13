import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-info.html',
  styleUrls: ['./account-info.css'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  user = signal<User | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isEditing = signal(false);
  isChangingPassword = signal(false);
  showPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  editedUser: Partial<User> = {};
  profileImagePreview = signal<string | null>(null);
  selectedProfileImage: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user.set(this.authService.getCurrentUser());

    this.authService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => this.isLoading.set(loading));

    this.authService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => this.errorMessage.set(error));

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => this.user.set(user));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startEditing(): void {
    if (this.user()) {
      this.editedUser = { ...this.user()! };
      this.profileImagePreview.set(this.user()?.profileImage || null);
      this.isEditing.set(true);
      this.errorMessage.set(null);
    }
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.editedUser = {};
    this.selectedProfileImage = null;
    this.profileImagePreview.set(null);
  }

  async saveProfile(): Promise<void> {
    if (!this.user()) return;

    this.errorMessage.set(null);

    try {
      const updates: Partial<User> = {
        name: this.editedUser.name || this.user()?.name,
        phone: this.editedUser.phone || null,
        country: this.editedUser.country || null,
        city: this.editedUser.city || null,
      };

      if (this.selectedProfileImage) {
        updates.profileImage = this.selectedProfileImage as any;
      }

      await this.authService.updateProfile(updates);
      this.successMessage.set('Profile updated successfully!');
      this.isEditing.set(false);
      this.selectedProfileImage = null;

      setTimeout(() => this.successMessage.set(null), 3000);
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }
async onProfileImageSelected(event: any): Promise<void> {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    this.errorMessage.set('Please select a valid image file');
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    this.errorMessage.set('Image size must not exceed 5MB');
    return;
  }

  this.selectedProfileImage = file;

  // Read file as Data URL
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const dataUrl = e.target.result;
    this.profileImagePreview.set(dataUrl);

    // حفظ الصورة في localStorage
    localStorage.setItem('profileImage', dataUrl);
  };
  reader.readAsDataURL(file);
}


  startChangingPassword(): void {
    this.isChangingPassword.set(true);
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage.set(null);
  }

  cancelPasswordChange(): void {
    this.isChangingPassword.set(false);
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  async changePassword(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('New passwords do not match');
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.errorMessage.set(null);

    try {
      await this.authService.updatePassword(this.newPassword);
      this.successMessage.set('Password changed successfully!');
      this.isChangingPassword.set(false);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';

      setTimeout(() => this.successMessage.set(null), 3000);
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

 // component.ts
getProfileImageFromLocalStorage(): string | null {
  return localStorage.getItem('profileImageURL');
}

}
