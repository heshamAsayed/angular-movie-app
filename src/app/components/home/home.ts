import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { API } from '../../services/server/api';
import { LazyLoadDirective } from '../../directives/lazy-load';
import { AutoplayVideos } from "../autoplay-videos/autoplay-videos";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LazyLoadDirective, AutoplayVideos],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  popularMovies$!: Observable<Movie[]>;
  nowPlayingMovies$!: Observable<Movie[]>;
  topRatedMovies$!: Observable<Movie[]>;
  upcomingMovies$!: Observable<Movie[]>;

  featuredMovie: Movie | null = null;

  private readonly ITEMS_PER_SECTION = 15;

  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  backdropBaseUrl = 'https://image.tmdb.org/t/p/original';

  // Genre Names
  private genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  constructor(
    private apiService: API,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadFeaturedMovie();
  }

  // ---------------------------
  // Load Movies Sections
  // ---------------------------
  loadMovies(): void {
    this.popularMovies$ = this.apiService.getPopularMovies(1, 'en').pipe(
      map(res => res.results.slice(0, this.ITEMS_PER_SECTION))
    );

    this.nowPlayingMovies$ = this.apiService.getNowPlayingMovies(1, 'en').pipe(
      map(res => res.results.slice(0, this.ITEMS_PER_SECTION))
    );

    this.topRatedMovies$ = this.apiService.getTopRatedMovies(1, 'en').pipe(
      map(res => res.results.slice(0, this.ITEMS_PER_SECTION))
    );

    this.upcomingMovies$ = this.apiService.getUpcomingMovies(1, 'en').pipe(
      map(res => res.results.slice(0, this.ITEMS_PER_SECTION))
    );
  }

  // ---------------------------
  // Featured Movie for Banner
  // ---------------------------
  loadFeaturedMovie(): void {
    this.apiService.getPopularMovies(1, 'en')
      .pipe(take(1))
      .subscribe(res => {
        if (res?.results?.length > 0) {
          const movies = res.results.slice(0, 5);
          this.featuredMovie = movies[Math.floor(Math.random() * movies.length)];
        }
      });
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  getMoviePoster(path: string | null): string {
    return path ? `${this.imageBaseUrl}${path}` : 'assets/images/no-poster.jpg';
  }

  getMovieBackdrop(path: string | null): string {
    return path ? `${this.backdropBaseUrl}${path}` : 'assets/images/no-backdrop.jpg';
  }

  getRatingColor(rating: number): string {
    if (rating >= 7.5) return 'var(--rating-high)';
    if (rating >= 6) return 'var(--rating-medium)';
    return 'var(--rating-low)';
  }

  getFirstGenre(movie: Movie): string {
    if (!movie.genre_ids?.length) return 'General';
    return this.genreMap[movie.genre_ids[0]] || 'General';
  }

  getFeaturedYear(): string {
    if (!this.featuredMovie?.release_date) return '';
    return new Date(this.featuredMovie.release_date).getFullYear().toString();
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  navigateToDetails(movieId: number | undefined) {
    if (!movieId) return;
    this.router.navigate(['/details', movieId]);
  }

  navigateToGroup(category: string) {
    this.router.navigate(['/group-movies', category]);
  }
}
