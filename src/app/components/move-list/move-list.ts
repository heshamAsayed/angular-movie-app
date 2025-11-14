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

@Component({
  selector: 'app-move-list',
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
  movies$!: Observable<any[]>;
  genres$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;
  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;

  selectedGenre: number | null = null;
  watchlist: Set<number> = new Set();

  constructor(private movieDisplay: MovieDisplay, private router: Router , private watchlistService: WatchlistService){
    this.movies$ = this.movieDisplay.movies$;
    this.genres$ = this.movieDisplay.genres$;
    this.isLoading$ = this.movieDisplay.isLoading$;
    this.currentPage$ = this.movieDisplay.currentPage$;
    this.totalPages$ = this.movieDisplay.totalPages$;

  }

  ngOnInit(): void {
    this.movieDisplay.loadGenres();
    this.movieDisplay.loadMovies();
    this.loadWatchlist(); 
    this.watchlistService.watchlist$.subscribe((ids) => {
      this.watchlist = new Set(ids); 
    });
  }

  nextPage() {
    this.movieDisplay.nextPage();
  }

  prevPage() {
   
    this.movieDisplay.prevPage();

  }

  // ⭐ غيّر الاسم والـ parameter type
  onGenreChange(genreId: string) {
    this.selectedGenre = genreId ? +genreId : null;
    this.movieDisplay.setGenre(this.selectedGenre);
  }

  searchByTitle(title: string) {
    this.movieDisplay.filterMovies(title);
  }


  toggleWatchlist(movie: any) {
  this.watchlistService.toggleMovie(movie.id); // استخدم التوغل من السيرفس
  }
  updateWatchlistLocally() {
  this.watchlistService.updateWatchlist(this.watchlist);
}

  isInWatchlist(movieId: number): boolean {
    return this.watchlist.has(movieId);
  }

  
  viewDetails(movie: any) {
    console.log('View details:', movie);
    // Navigate to movie details page
    if (movie && movie.id) {
      this.router.navigate(['/details', movie.id]);
    }
  }

  private loadWatchlist() {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      this.watchlist = new Set(JSON.parse(saved));
    }
  }
totalPages = 500;
pagesPerBlock = 10;

get currentBlockStart(): number {
  return Math.floor((this.currentPage - 1) / this.pagesPerBlock) * this.pagesPerBlock + 1;
}

get currentBlockPages(): number[] {
  return Array.from(
    { length: this.pagesPerBlock },
    (_, i) => this.currentBlockStart + i
  ).filter(p => p <= this.totalPages);
}

goToPage(page: number) {
  this.currentPage = page; // حدّث الصفحة الحالية
  this.movieDisplay.loadMovies(page); // حدث الـ service بالصفحة الجديدة
  // this.movieDisplay.loadMovies();   // جلب الأفلام للصفحة الجديدة
}

nextBlock() {
  const next = this.currentBlockStart + this.pagesPerBlock;
  if (next <= this.totalPages) {
    this.currentPage = next;
    this.movieDisplay.loadMovies();

  }
}

prevBlock() {
  const prev = this.currentBlockStart - this.pagesPerBlock;
  if (prev >= 1) {
    this.currentPage = prev;
    this.movieDisplay.loadMovies();

  }
}


}