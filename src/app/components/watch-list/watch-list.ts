import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WatchlistService } from '../../services/watchList/watchlist.service';
import { API } from '../../services/server/api';
import { Location } from '@angular/common';
import { MovieDisplay } from '../../services/Display/movie-display';
import { forkJoin, combineLatest } from 'rxjs';
import { Movie } from '../../models/Movie/movie-module'; 
import { Genre } from '../../models/genre/genre-module'; 

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule ],
  templateUrl: './watch-list.html',
  styleUrls: ['./watch-list.css'],
})
export class WatchList implements OnInit {
  isLoading = true;
  watchlistIds: Set<number> = new Set();
  watchlistMovies: Movie[] = []; // Use Movie interface instead of any

  constructor(
    private watchlistService: WatchlistService,
    private api: API,
    private location: Location,
    private movieDisplay: MovieDisplay
  ) {}

  ngOnInit(): void {
    // ✅ Listen for both watchlist changes and language changes together
    combineLatest([
      this.watchlistService.watchlist$,
      this.movieDisplay.language$
    ]).subscribe(([ids, lang]) => {
      this.watchlistIds = new Set(ids);
      this.loadMoviesDetails(lang);
    });
  }

  /** 
   * Load all movies in the watchlist using the current language
   */
  private loadMoviesDetails(lang: string): void {
    this.isLoading = true;
    const requests = Array.from(this.watchlistIds).map(id =>
      this.movieDisplay.getMovieByIdWithVideos(id, lang) // Use MovieDisplay service
    );

    // ✅ Handle empty watchlist
    if (requests.length === 0) {
      this.watchlistMovies = [];
      this.isLoading = false;
      return;
    }

    // ✅ Execute all requests in parallel using forkJoin
    forkJoin(requests).subscribe({
      next: (results: Movie[]) => {
        this.watchlistMovies = results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  /** Remove a movie from the watchlist and update the observable */
  removeMovie(movieId: number): void {
    const newSet = new Set(this.watchlistIds);
    newSet.delete(movieId);
    this.watchlistService.updateWatchlist(newSet);
  }

  /** Convert vote average (0-10) to a 5-star rating array */
  getStarRating(voteAverage: number): number[] {
    const rating = Math.round(voteAverage / 2);
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }

  /** Navigate back to the previous page */
  goBack(): void {
    this.location.back();
  }
}
