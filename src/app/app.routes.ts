import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Home } from './components/home/home';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.RegisterPage),
  },{
    path: 'home',
    loadComponent: () =>
      import('./components/home/home').then((m) => m.Home),
    title: 'Home - Movie Hub'
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./components/move-list/move-list').then((m) => m.MoveList),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details').then((m) => m.Details),
	  title: 'Movie Details - Movie Hub'
  },
  {
    path: 'group-movies/:category',
    loadComponent: () =>
      import('./components/group-movies/group-movies').then((m) => m.GroupMovies),
    title: 'Movies - Movie Hub'
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./components/watch-list/watch-list').then((m) => m.WatchList),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/account-info/account-info').then(
        (m) => m.AccountInfoComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./components/not-found/not-found').then(
        (m) => m.NotFoundComponent
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'error' },
];
