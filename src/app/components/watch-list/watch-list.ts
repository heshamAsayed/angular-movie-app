import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WatchlistService } from '../../services/watchList/watchlist.service';
import { API } from '../../services/server/api';
import { Location } from '@angular/common';
import { MovieDisplay } from '../../services/Display/movie-display';
import { forkJoin, combineLatest } from 'rxjs';

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './watch-list.html',
  styleUrls: ['./watch-list.css'],
})
export class WatchList implements OnInit {
  isLoading: boolean = true;
  watchlistIds: Set<number> = new Set();
  watchlistMovies: any[] = [];

  constructor(
    private watchlistService: WatchlistService,
    private api: API,
    private location: Location,
    private movieDisplay: MovieDisplay
  ) {}

  ngOnInit(): void {
    // ✅ نستخدم combineLatest عشان ناخد اللغـة والـ watchlist مع بعض
    combineLatest([
      this.watchlistService.watchlist$,
      this.movieDisplay.language$
    ]).subscribe(([ids, lang]) => {
      this.watchlistIds = new Set(ids);
      this.loadMoviesDetails(lang);
    });
  }

  private loadMoviesDetails(lang: string) {
    this.isLoading = true;
    const requests = Array.from(this.watchlistIds).map(id =>
      this.api.getMovieByIdWithVideos(id, lang)
    );

    if (requests.length === 0) {
      this.watchlistMovies = [];
      this.isLoading = false;
      return;
    }

    // ✅ استخدام forkJoin بدلاً من toPromise
    forkJoin(requests).subscribe({
      next: (results) => {
        this.watchlistMovies = results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  removeMovie(movieId: number) {
    const newSet = new Set(this.watchlistIds);
    newSet.delete(movieId);
    this.watchlistService.updateWatchlist(newSet);
  }

  getStarRating(voteAverage: number): number[] {
    const rating = Math.round(voteAverage / 2);
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }

  goBack() {
    this.location.back();
  }
}
