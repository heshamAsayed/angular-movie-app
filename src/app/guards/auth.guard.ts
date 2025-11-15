import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/Authentication/auth.service';
// import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import {
  CanActivate,
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }

        // Store the attempted URL for redirecting after login
        sessionStorage.setItem('redirectUrl', state.url);

        // Return UrlTree instead of navigate
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}


// Standalone guard function
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) return true;

      sessionStorage.setItem('redirectUrl', state.url);
      return router.createUrlTree(['/login']);
    })
  );
};


