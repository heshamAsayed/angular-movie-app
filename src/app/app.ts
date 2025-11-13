import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MovieDisplay } from './services/Display/movie-display';
import { WatchlistService } from './services/watchList/watchlist.service';
import { AuthService } from './services/Authentication/auth.service';
import { Router } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { User } from './models/user.model';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FirebaseModule } from './models/firebase/firebase-module';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NgIf,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  readonly title = signal('Movie_APP');
  isLoggedIn = false;
  favoritesCount = 3;
  currentYear = new Date().getFullYear();
  currentUser$: Observable<User | null>;

  public readonly isDarkMode = signal(localStorage.getItem('darkMode') === 'true');

  /* cspell:disable */
  showSocial: { [key: string]: boolean } = {
    ahmed: false,
    andrew: false,
    hesham: false,
    'mohamed-g': false,
    'mohamed-n': false,
    hassan: false,
  };
  /* cspell:enable */

  languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' },
  ];

  selectedLanguage =
    this.languages.find((l) => l.code === localStorage.getItem('selectedLanguage')) ||
    this.languages[0];

  isLoggedIn$!: Observable<boolean>; // declare first

  constructor(
    private movieDisplay: MovieDisplay,
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private router: Router
  ) {
    // Apply initial theme
    this.applyTheme(this.isDarkMode());

    // Initialize service with selected language
    this.movieDisplay.setLanguage(this.selectedLanguage.code);

    // Initialize observable properly here
    this.isLoggedIn$ = this.authService.isAuthenticated$;

    this.currentUser$ = this.authService.currentUser$;
  }

  NumberwatchlistMovies: number = 0;
  showLoginMessage = false;

navigateToWatchlist() {
  this.authService.isAuthenticated$.subscribe(isLoggedIn => {
    if (isLoggedIn) {
      // لو مسجل دخول روح على watchlist
      this.router.navigate(['/watchlist']);
    } else {
      // لو مش مسجل دخول
      this.showLoginMessage = true;

      // اختفاء الرسالة بعد 3 ثواني
      setTimeout(() => {
        this.showLoginMessage = false;
      }, 3000);

      // توجيه المستخدم للصفحة الرئيسية أو تسجيل الدخول
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: '/watchlist',
          message: 'login_required_watchlist' 
        } 
      });
    }
  }).unsubscribe();
}

navigateToProfile() {
  this.authService.isAuthenticated$.subscribe(isLoggedIn => {
    if (isLoggedIn) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: '/profile',
          message: 'login_required_profile' 
        } 
      });
    }
  }).unsubscribe();
}

  ngOnInit(): void {
    this.watchlistService.watchlist$.subscribe((ids) => {
      this.NumberwatchlistMovies = ids.size;
    });

    this.NumberwatchlistMovies = 0;

    // تابع الـ auth
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        // المستخدم عامل login → جلب watchlist من الـ DB
        this.watchlistService.watchlist$.subscribe((ids) => {
          this.NumberwatchlistMovies = ids.size;
        });
      }
    });

    this.authService.isAuthenticated$.subscribe((loggedIn) => {
      if (loggedIn) {
        // لو المستخدم عامل login مسبقًا
        this.router.navigate(['/watchlist']);
      }
    });

    // متابعة watchlist count
    this.watchlistService.watchlist$.subscribe((ids) => {
      this.NumberwatchlistMovies = ids.size;
    });
  }

  login() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/movies']);
      this.isLoggedIn = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = true;
    this.watchlistService.clearWatchlist();     
  }

  toggleTheme = () => {
    this.isDarkMode.update((dark) => !dark);
    this.applyTheme(this.isDarkMode());
    localStorage.setItem('darkMode', this.isDarkMode().toString());
  };

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-mode', isDark);
  }

  toggleSocial(devName: string, event: Event) {
    event.stopPropagation();
    Object.keys(this.showSocial).forEach((key) => {
      if (key !== devName) {
        this.showSocial[key] = false;
      }
    });
    this.showSocial[devName] = !this.showSocial[devName];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    Object.keys(this.showSocial).forEach((key) => {
      this.showSocial[key] = false;
    });
  }

  onLanguageChange(language: any) {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', language.code);
    this.movieDisplay.setLanguage(language.code);
  }

  animations = [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ];


  // component.ts
getProfileImageFromLocalStorage(): string | null {
  return localStorage.getItem('profileImageURL');
}

// showLoginMessage = false;

// navigateToWatchlist(event: Event) {
//   event.preventDefault(); // منع إعادة تحميل الصفحة
//   this.authService.isAuthenticated$.subscribe(isLoggedIn => {
//     if (isLoggedIn) {
//       this.router.navigate(['/watchlist']);
//     } else {
//       this.showLoginMessage = true;

//       setTimeout(() => {
//         this.showLoginMessage = false;
//       }, 3000);

//       // توجه المستخدم للـ login مع returnUrl
//       this.router.navigate(['/login'], { 
//         queryParams: { 
//           returnUrl: '/watchlist',
//           message: 'login_required_watchlist' 
//         } 
//       });
//     }
//   }).unsubscribe();
// }


}

// bootstrapApplication(App, {
//   providers: [
//     provideFirebaseApp(() => initializeApp(environment.firebase)),
//     provideAuth(() => getAuth()),
//     provideDatabase(() => getDatabase()),
//     provideStorage(() => getStorage()),
//   ],
// });
