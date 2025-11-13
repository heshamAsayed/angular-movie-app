import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Database, ref, onValue, set } from '@angular/fire/database';
import { AuthService } from '../Authentication/auth.service';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private db: Database = inject(Database);
  private storageKey = 'watchlist';
  private watchlistSubject: BehaviorSubject<Set<number>>;
  public watchlist$;
  private currentUid: string | null = null;

  constructor(private authService: AuthService) {
    const saved = localStorage.getItem(this.storageKey);
    const initialSet = saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    this.watchlistSubject = new BehaviorSubject<Set<number>>(initialSet);
    this.watchlist$ = this.watchlistSubject.asObservable();

    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user && user.uid) {
        this.currentUid = user.uid;
        this.listenToWatchlist(user.uid);
      } else {
        this.currentUid = null;
        this.clearWatchlist();
      }
    });
  }

  private listenToWatchlist(uid: string) {
    const watchlistRef = ref(this.db, `users/${uid}/watchlist`);
    onValue(watchlistRef, snapshot => {
      const data = snapshot.val() as number[] | null;
      const newSet = data ? new Set<number>(data) : new Set<number>();
      this.watchlistSubject.next(newSet);
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(newSet)));
    });
  }

  clearWatchlist() {
    const emptySet = new Set<number>();
    this.watchlistSubject.next(emptySet);
    localStorage.setItem(this.storageKey, JSON.stringify([]));
    if (this.currentUid) {
      const watchlistRef = ref(this.db, `users/${this.currentUid}/watchlist`);
      set(watchlistRef, []).catch(err => console.error(err));
    }
  }

  updateWatchlist(watchlist: Set<number>) {
    const newSet = new Set(watchlist);
    this.watchlistSubject.next(newSet);

    const watchlistArray = Array.from(newSet);
    localStorage.setItem(this.storageKey, JSON.stringify(watchlistArray));

    if (this.currentUid) {
      const watchlistRef = ref(this.db, `users/${this.currentUid}/watchlist`);
      set(watchlistRef, watchlistArray).catch(err => console.error(err));
    }
  }

  toggleMovie(id: number) {
    const newSet = new Set(this.watchlistSubject.value);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    this.updateWatchlist(newSet);
  }
}
