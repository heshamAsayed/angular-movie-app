import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from '../../services/server/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-group-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./group-movies.html',
  styleUrls: ['./group-movies.css']
})
export class GroupMovies implements OnInit {
  movies$!: Observable<any[]>;
  category!: string;

  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private apiService: API, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.params['category'];
    this.loadMovies();
  }

  loadMovies() {
    switch(this.category) {
      case 'popular':
        this.movies$ = this.apiService.getPopularMovies().pipe(map(res => res.results));
        break;
      case 'now-playing':
        this.movies$ = this.apiService.getNowPlayingMovies().pipe(map(res => res.results));
        break;
      case 'top-rated':
        this.movies$ = this.apiService.getTopRatedMovies().pipe(map(res => res.results));
        break;
      case 'upcoming':
        this.movies$ = this.apiService.getUpcomingMovies().pipe(map(res => res.results));
        break;
      default:
        this.movies$ = this.apiService.discoverMovies({}, 'en').pipe(map(res => res.results));
    }
  }

  getMoviePoster(path: string) {
    return path ? `${this.imageBaseUrl}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }

  navigateToDetails(movieId: number) {
    this.router.navigate(['/details', movieId]);
  
  }

  getRatingColor(rating: number): string {
  if (rating >= 7.5) return 'var(--rating-high)';
  if (rating >= 6.0) return 'var(--rating-medium)';
  return 'var(--rating-low)';
}

}
