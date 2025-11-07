import { Component, signal , HostListener} from '@angular/core';
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
  isDarkMode = false;

  login = () => this.isLoggedIn = true;
  logout = () => this.isLoggedIn = false;
  toggleTheme = () => this.isDarkMode = !this.isDarkMode;




 showSocial: { [key: string]: boolean } = {
    'ahmed': false,
    'andrew': false,
    'hesham': false,
    'mohamed-g': false,
    'mohamed-n': false,
    'hassan': false
  };

  toggleSocial(devName: string, event: Event) {
    event.stopPropagation();
    
    // Close all other social links
    Object.keys(this.showSocial).forEach(key => {
      if (key !== devName) {
        this.showSocial[key] = false;
      }
    });
    
    // Toggle current one
    this.showSocial[devName] = !this.showSocial[devName];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close all social links when clicking anywhere
    Object.keys(this.showSocial).forEach(key => {
      this.showSocial[key] = false;
    });
  }


  
}
