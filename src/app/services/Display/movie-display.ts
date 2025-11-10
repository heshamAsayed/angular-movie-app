import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { API } from '../server/api';
import { Movie } from '../../models/Movie/movie-module'; 
import { Genre } from '../../models/genre/genre-module'; 

@Injectable({
  providedIn: 'root'
})
export class MovieDisplay {
  // Observables
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.moviesSubject.asObservable();

  private genresSubject = new BehaviorSubject<Genre[]>([]);
  public genres$ = this.genresSubject.asObservable();

  private languageSubject: BehaviorSubject<string>;
  public language$: Observable<string>;

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  public totalPages$ = this.totalPagesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private selectedGenreSubject = new BehaviorSubject<number | null>(null);
  public selectedGenre$ = this.selectedGenreSubject.asObservable();

  private allMovies: Movie[] = [];

  constructor(private api: API) {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.languageSubject = new BehaviorSubject<string>(savedLang);
    this.language$ = this.languageSubject.asObservable();

    // Reload genres and movies when language changes
    this.language$.subscribe((lang) => {
      this.loadGenres();
      this.loadMovies(this.currentPageSubject.value);
    });
  }

  /** 
   * Set language for UI only
   * Does NOT reload movies or genres automatically
   */
  setLanguage(lang: string) {
    this.languageSubject.next(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  /** Set selected genre and reset page to 1 */
  setGenre(genreId: number | null) {
    this.selectedGenreSubject.next(genreId);
    this.loadMovies(1); // Reset to first page when genre changes
  }

  /** Fetch movies manually, uses current language and selected genre */
  loadMovies(page: number = this.currentPageSubject.value) {
    const genreId = this.selectedGenreSubject.value;
    const language = this.languageSubject.value;

    this.isLoadingSubject.next(true);

    const filters: any = { page: page.toString() };
    if (genreId) filters.with_genres = genreId.toString();

    this.api.discoverMovies(filters, language)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((res: any) => {
        this.allMovies = res.results;
        this.moviesSubject.next(res.results);
        this.currentPageSubject.next(res.page);
        this.totalPagesSubject.next(res.total_pages);
      });
  }

  /** Fetch genres manually, uses current language */
  loadGenres() {
    const language = this.languageSubject.value;
    this.api.getGenres(language).subscribe((res: any) => {
      this.genresSubject.next(res.genres);
    });
  }

  /** Pagination */
  nextPage() {
    const next = this.currentPageSubject.value + 1;
    if (next <= this.totalPagesSubject.value) this.loadMovies(next);
  }

  prevPage() {
    const prev = this.currentPageSubject.value - 1;
    if (prev >= 1) this.loadMovies(prev);
  }

  /** Filter movies locally without API call */
  filterMovies(title: string) {
    if (!title) {
      this.moviesSubject.next(this.allMovies);
    } else {
      const filtered = this.allMovies.filter(movie =>
        movie.title.toLowerCase().includes(title.toLowerCase())
      );
      this.moviesSubject.next(filtered);
    }
  }

  /** Get a single movie by ID, optionally using a specific language */
  getMovieByIdWithVideos(id: number, lang?: string) {
    const language = lang || this.languageSubject.value;
    return this.api.getMovieByIdWithVideos(id, language);
  }
}
