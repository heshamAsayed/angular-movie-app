import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';
import { GoogleAuthProvider, signInWithPopup ,FacebookAuthProvider } from '@angular/fire/auth';
import { from } from 'rxjs';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { getDatabase, ref, set } from 'firebase/database';
import { getApp } from 'firebase/app';

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
      confirm: ['', Validators.required],
      phone: [''],
      country: [''],
      city: [''],
      agreedToTerms: [false, Validators.requiredTrue],
    });
  }

  selectedProfileImage: File | undefined = undefined;
  profileImagePreview: string | undefined = undefined;

  // عند اختيار الصورة
  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image size must not exceed 5MB';
      return;
    }

    this.selectedProfileImage = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // أثناء التسجيل، رفع الصورة وأخذ الـ download URL
async uploadProfileImage(): Promise<string | undefined> {
  if (!this.selectedProfileImage) return undefined;

  try {
    const storage = getStorage();
    const fileRef = storageRef(storage, `profile-images/${Date.now()}_${this.selectedProfileImage.name}`);
    const snapshot = await uploadBytes(fileRef, this.selectedProfileImage);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

// register.component.ts - Fixed submit method

async submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.error = 'Please fill all required fields correctly';
    return;
  }

  if (this.form.value.password !== this.form.value.confirm) {
    this.error = 'Passwords do not match';
    return;
  }

  this.loading = true;
  this.error = '';

  try {
    // رفع الصورة أولًا إذا موجودة
    let profileImageURL: string | undefined = undefined;
    
    if (this.selectedProfileImage) {
      try {
        profileImageURL = await this.uploadProfileImage();
        console.log('Image uploaded successfully:', profileImageURL);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // نكمل التسجيل حتى لو فشل رفع الصورة
        this.error = 'Image upload failed, but account will be created without image';
      }
    }

    // تسجيل المستخدم
    this.auth
      .register(
        this.form.value.email,
        this.form.value.password,
        this.form.value.name,
        profileImageURL
      )
      .subscribe({
        next: (user) => {
          console.log('Registration successful:', user);
          this.loading = false;
          // التوجيه للصفحة التالية
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.loading = false;
          this.error = err.message || err.code || 'Server error, please try again';
        },
      });
  } catch (err: any) {
    console.error('Submit error:', err);
    this.loading = false;
    this.error = err.message || 'An error occurred, please try again';
  }
}
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth.auth, provider).then((res) => res.user));
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
