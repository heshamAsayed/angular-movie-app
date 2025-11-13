import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { API } from '../server/api';

@Injectable({
  providedIn: 'root'
})
export class MovieDisplay {
  private moviesSubject = new BehaviorSubject<any[]>([]);
  public movies$ = this.moviesSubject.asObservable();

  private genresSubject = new BehaviorSubject<any[]>([]);
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

  /** Cache لكل الصفحات: {page: movies[]} */
  private cachedPages: Record<number, any[]> = {};

  constructor(private api: API) {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.languageSubject = new BehaviorSubject<string>(savedLang);
    this.language$ = this.languageSubject.asObservable();

    this.language$.subscribe((lang) => {
      this.cachedPages = {}; // إعادة تعيين الكاش عند تغيير اللغة
      this.loadGenres();
      this.loadMovies(1);
    });
  }

  setLanguage(lang: string) {
    this.languageSubject.next(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  setGenre(genreId: number | null) {
    this.selectedGenreSubject.next(genreId);
    this.cachedPages = {}; // إعادة تعيين الكاش عند تغيير النوع
    this.loadMovies(1);
  }

  loadMovies(page: number = this.currentPageSubject.value) {
    const genreId = this.selectedGenreSubject.value;
    const language = this.languageSubject.value;

    // لو الصفحة موجودة في الكاش، استخدمها مباشرة
    if (this.cachedPages[page]) {
      this.moviesSubject.next(this.cachedPages[page]);
      this.currentPageSubject.next(page);
      return;
    }

    this.isLoadingSubject.next(true);

    const filters: any = { page: page.toString() };
    if (genreId) filters.with_genres = genreId.toString();

    this.api.discoverMovies(filters, language)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((res: any) => {
        this.cachedPages[page] = res.results; // تخزين الصفحة في الكاش
        this.moviesSubject.next(res.results);
        this.currentPageSubject.next(res.page);
        this.totalPagesSubject.next(res.total_pages);
      });
  }

  loadGenres() {
    const language = this.languageSubject.value;
    this.api.getGenres(language).subscribe((res: any) => {
      this.genresSubject.next(res.genres);
    });
  }

  nextPage() {
    const next = this.currentPageSubject.value + 1;
    if (next <= this.totalPagesSubject.value) this.loadMovies(next);
  }

  prevPage() {
    const prev = this.currentPageSubject.value - 1;
    if (prev >= 1) this.loadMovies(prev);
  }

  filterMovies(title: string) {
    const allMovies = Object.values(this.cachedPages).flat();
    if (!title) {
      this.moviesSubject.next(allMovies);
    } else {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(title.toLowerCase())
      );
      this.moviesSubject.next(filtered);
    }
  }

  getMovieByIdWithVideos(id: number, lang?: string) {
    const language = lang || this.languageSubject.value;
    return this.api.getMovieByIdWithVideos(id, language);
  }
}
