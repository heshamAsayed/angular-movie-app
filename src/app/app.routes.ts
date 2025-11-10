import { Routes } from '@angular/router';

export const routes: Routes = [
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
    loadComponent: () =>
      import('./components/watch-list/watch-list').then(m => m.WatchList),
  },
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'movies' } 
];
