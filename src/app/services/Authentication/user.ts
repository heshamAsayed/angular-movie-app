import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class User {
  private isLoggedIn = false;

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn = true;
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
