import { Routes } from '@angular/router';
import { WatchList } from './components/watch-list/watch-list';
import { AuthGuard } from './guards/auth.guard';
import { AccountInfoComponent } from './components/account-info/account-info';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./components/move-list/move-list').then(m => m.MoveList),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details').then(m => m.Details),
  },{
    path: 'watchlist',
    component: WatchList,
    canActivate: [AuthGuard],
    // loadComponent: () =>
    //   import('./components/watch-list/watch-list').then(m => m.WatchList),
  },{
    path: 'profile',
    component: AccountInfoComponent,
    canActivate: [AuthGuard],
    // loadComponent: () =>
    //   import('./components/account-info/account-info').then(m => m.AccountInfoComponent),
  },
 {
  path:'error',
  loadComponent: () =>
    import('./components/not-found/not-found').then(m => m.NotFoundComponent),
 },{
  path:'change-password',
  loadComponent: () =>
    import('./components/reset-password/reset-password').then(m => m.ResetPasswordComponent),
 },
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'error' } 
  // { path: '', redirectTo: 'movies', pathMatch: 'full' },
  // { path: '**', redirectTo: 'movies' }

];
