import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'movies',
    loadComponent: () =>
      import('./components/move-list/move-list').then(m => m.MoveList),
  },
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'movies' } 
];
