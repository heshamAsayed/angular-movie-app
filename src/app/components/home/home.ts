import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../services/server/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  popularMovies$!: Observable<any[]>;
  nowPlayingMovies$!: Observable<any[]>;
  topRatedMovies$!: Observable<any[]>;
  upcomingMovies$!: Observable<any[]>;
  featuredMovie: any = null;

  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  backdropBaseUrl = 'https://image.tmdb.org/t/p/original';

  constructor(private apiService: API, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.popularMovies$ = this.apiService.getPopularMovies(1, 'en').pipe(
      map(res => res.results.slice(0, 8))
    );
    this.nowPlayingMovies$ = this.apiService.getNowPlayingMovies(1, 'en').pipe(
      map(res => res.results.slice(0, 8))
    );
    this.topRatedMovies$ = this.apiService.getTopRatedMovies(1, 'en').pipe(
      map(res => res.results.slice(0, 8))
    );
    this.upcomingMovies$ = this.apiService.getUpcomingMovies(1, 'en').pipe(
      map(res => res.results.slice(0, 8))
    );

    this.apiService.getPopularMovies(1, 'en').subscribe(res => {
      this.featuredMovie = res.results[0];
    });
  }

  getMoviePoster(path: string) {
    return path ? `${this.imageBaseUrl}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }

  getMovieBackdrop(path: string) {
    return path ? `${this.backdropBaseUrl}${path}` : 'https://via.placeholder.com/1920x1080?text=No+Image';
  }

  getRatingColor(rating: number): string {
    if (rating >= 7.5) return 'var(--rating-high)';
    if (rating >= 6) return 'var(--rating-medium)';
    return 'var(--rating-low)';
  }

  navigateToDetails(movieId: number) {
    this.router.navigate(['/details', movieId]);
  }

  navigateToGroup(category: string) {
    this.router.navigate(['/group-movies', category]);
  }
}
