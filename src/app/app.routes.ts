import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./components/move-list/move-list').then(m => m.MoveList),
  },
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: '**', redirectTo: 'movies' }

];
