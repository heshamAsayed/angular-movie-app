import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MovieDisplay } from '../../services/Display/movie-display';
import { WatchlistService } from '../../services/watchList/watchlist.service';
import { AutoplayVideos } from "../autoplay-videos/autoplay-videos";
import { Movie } from '../../models/Movie/movie-module'; 
import { Genre } from '../../models/genre/genre-module'; 

@Component({
  selector: 'app-move-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AutoplayVideos
  ],
  templateUrl: './move-list.html',
  styleUrls: ['./move-list.css'],
})
export class MoveList implements OnInit {
  currentPage = 1;
  movies$!: Observable<Movie[]>; // Use Movie interface
  genres$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;
  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;

  selectedGenre: number | null = null;
  watchlist: Set<number> = new Set();

  constructor(
    private movieDisplay: MovieDisplay,
    private router: Router,
    private watchlistService: WatchlistService
  ) {
    // ✅ Bind observables from MovieDisplay service
    this.movies$ = this.movieDisplay.movies$ as Observable<Movie[]>;
    this.genres$ = this.movieDisplay.genres$;
    this.isLoading$ = this.movieDisplay.isLoading$;
    this.currentPage$ = this.movieDisplay.currentPage$;
    this.totalPages$ = this.movieDisplay.totalPages$;
  }

  ngOnInit(): void {
    // ✅ Initial load of genres and movies
    this.movieDisplay.loadGenres();
    this.movieDisplay.loadMovies();

    // ✅ Load saved watchlist from localStorage
    this.loadWatchlist();

    // ✅ Subscribe to watchlist updates to keep local state in sync
    this.watchlistService.watchlist$.subscribe((ids) => {
      this.watchlist = new Set(ids);
    });
  }

  /** Pagination controls */
  nextPage() {
    this.movieDisplay.nextPage();
  }

  prevPage() {
    this.movieDisplay.prevPage();
  }

  /** Triggered when user selects a genre from dropdown */
  onGenreChange(genreId: string) {
    this.selectedGenre = genreId ? +genreId : null;
    this.movieDisplay.setGenre(this.selectedGenre);
  }

  /** Filter movies locally by title */
  searchByTitle(title: string) {
    this.movieDisplay.filterMovies(title);
  }

  /** Add or remove a movie from the watchlist */
  toggleWatchlist(movie: Movie) {
    this.watchlistService.toggleMovie(movie.id);
  }

  /** Update local watchlist manually if needed */
  updateWatchlistLocally() {
    this.watchlistService.updateWatchlist(this.watchlist);
  }

  /** Check if movie exists in watchlist */
  isInWatchlist(movieId: number): boolean {
    return this.watchlist.has(movieId);
  }

  /** Navigate to movie details page */
  viewDetails(movie: Movie) {
    console.log('View details:', movie);
    if (movie && movie.id) {
      this.router.navigate(['/details', movie.id]);
    }
  }

  /** Load watchlist from localStorage on component init */
  private loadWatchlist() {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      this.watchlist = new Set(JSON.parse(saved));
    }
  }
}
