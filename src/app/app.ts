import { Component, signal, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
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
    MatDividerModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  readonly title = signal('Movie_APP');
  isLoggedIn = false;
  favoritesCount = 3;
  currentYear = new Date().getFullYear();
  public readonly isDarkMode = signal(localStorage.getItem('darkMode') === 'true');

  /* cspell:disable */
  showSocial: { [key: string]: boolean } = {
    'ahmed': false,
    'andrew': false,
    'hesham': false,
    'mohamed-g': false,
    'mohamed-n': false,
    'hassan': false
  };
  /* cspell:enable */

  // languages array 
  languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' }
  ];

  // Use last selected language from LocalStorage or default to first
  selectedLanguage = this.languages.find(l => l.code === localStorage.getItem('selectedLanguage')) || this.languages[0];

  constructor(private movieDisplay: MovieDisplay) {
    // Apply initial theme
    this.applyTheme(this.isDarkMode());

    // Initialize service with selected language
    this.movieDisplay.setLanguage(this.selectedLanguage.code);
  }

  login = () => this.isLoggedIn = true;
  logout = () => this.isLoggedIn = false;

  toggleTheme = () => {
    this.isDarkMode.update(dark => !dark);
    this.applyTheme(this.isDarkMode());
    localStorage.setItem('darkMode', this.isDarkMode().toString());
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-mode', isDark);
  }

  toggleSocial(devName: string, event: Event) {
    event.stopPropagation();
    Object.keys(this.showSocial).forEach(key => {
      if (key !== devName) {
        this.showSocial[key] = false;
      }
    });
    this.showSocial[devName] = !this.showSocial[devName];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    Object.keys(this.showSocial).forEach(key => {
      this.showSocial[key] = false;
    });
  }

  onLanguageChange(language: any) {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', language.code);
    this.movieDisplay.setLanguage(language.code);
  }
}
