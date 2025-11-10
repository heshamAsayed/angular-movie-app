import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private storageKey = 'watchlist';
  private watchlistSubject: BehaviorSubject<Set<number>>;
  public watchlist$;

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const initialSet = saved
      ? new Set<number>(JSON.parse(saved) as number[])
      : new Set<number>();

    this.watchlistSubject = new BehaviorSubject<Set<number>>(initialSet);
    this.watchlist$ = this.watchlistSubject.asObservable();
  }

  updateWatchlist(watchlist: Set<number>) {
    const newSet = new Set(watchlist);
    this.watchlistSubject.next(newSet);
    localStorage.setItem(this.storageKey, JSON.stringify(Array.from(newSet)));
  }

  toggleMovie(id: number) {
    const newSet = new Set(this.watchlistSubject.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.updateWatchlist(newSet);
  }
}
