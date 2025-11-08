import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // NOTE: These are simple stubs returning Observable<boolean>.
  // Replace with real HTTP calls to your backend.
  login(email: string, password: string): Observable<boolean> {
    const ok = !!email && !!password;
    return of(ok).pipe(delay(500));
  }

  register(email: string, password: string): Observable<boolean> {
    const ok = !!email && !!password;
    return of(ok).pipe(delay(600));
  }
}
