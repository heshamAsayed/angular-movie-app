import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieDisplay } from '../../services/Display/movie-display';
import { API } from '../../services/server/api'; // Update path as needed
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
// import { Component, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatCardModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details implements OnInit, AfterViewInit {
  @ViewChildren('scrollContainer0, scrollContainer1') scrollContainers!: QueryList<ElementRef>;

  movie: any = null;
  isLoading = false;
  trailerUrl: SafeResourceUrl | null = null;

  // Recommendations
  recommendations: any[] = [];
  firstRowRecommendations: any[] = [];
  secondRowRecommendations: any[] = [];
  showScrollButtons: { left: boolean; right: boolean }[] = [
    { left: false, right: false },
    { left: false, right: false }
  ];
  movieCredits: any;
  similarMovies: any[] = [];

  @ViewChild('creditsScroll') creditsScroll!: ElementRef;
  @ViewChild('recommendationsScroll') recommendationsScroll!: ElementRef;
  @ViewChild('similarScroll') similarScroll!: ElementRef;
  private currentMovieId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieDisplay: MovieDisplay,
    private apiService: API,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    // ✅ لو مفيش id، رجّع المستخدم لقائمة الأفلام
    if (!id) {
      this.router.navigate(['/movies']);
      return;
    }

    this.currentMovieId = id;

    // ✅ اشترك في اللغة وحمّل الفيلم كل ما اللغة تتغير
    this.movieDisplay.language$.subscribe(lang => {
      this.loadMovie(id, lang);
      this.loadRecommendations(id, lang);
    });


    // Get Movie Credits
    // في ngOnInit بعد تحميل الـ movie
    this.apiService.getMovieCredits(+id).subscribe({
      next: (data) => {
        this.movieCredits = data;
      },
      error: (err) => console.error('Error loading credits:', err)
    });

    this.apiService.getSimilarMovies(+id).subscribe({
      next: (data) => {
        this.similarMovies = data.results;
      },
      error: (err) => console.error('Error loading similar movies:', err)
    });
  }

  ngAfterViewInit(): void {
    // Check scroll buttons visibility after view init
    setTimeout(() => {
      this.checkScrollButtons();
    }, 500);
  }

  // ✅ دالة تحميل الفيلم من MovieDisplay
  private loadMovie(id: number, lang: string): void {
    this.isLoading = true;

    this.movieDisplay.getMovieByIdWithVideos(id, lang).subscribe({
      next: (res) => {
        this.movie = res;

        if (res.videos?.results?.length && res.videos.results[0]?.site === 'YouTube') {
          this.trailerUrl = this.getTrailerUrl(res.videos.results[0].key);
        } else {
          this.trailerUrl = null;
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/movies']);
      }
    });
  }

  // ✅ دالة تحميل الأفلام المقترحة
  private loadRecommendations(id: number, lang: string): void {
    this.apiService.getMovieRecommendations(id, lang).subscribe({
      next: (data: { results: never[]; }) => {
        this.recommendations = data.results || [];
        this.splitRecommendations();
        setTimeout(() => {
          this.checkScrollButtons();
        }, 100);
      },
      error: (err: any) => {
        console.error('Error loading recommendations:', err);
        this.recommendations = [];
        this.firstRowRecommendations = [];
        this.secondRowRecommendations = [];
      }
    });
  }

  // ✅ تقسيم الأفلام المقترحة لصفين
  private splitRecommendations(): void {
    const half = Math.ceil(this.recommendations.length / 2);
    this.firstRowRecommendations = this.recommendations.slice(0, half);
    this.secondRowRecommendations = this.recommendations.slice(half);
  }

  // ✅ السكرول الأفقي
  scrollRow(direction: 'left' | 'right', rowIndex: number): void {
    const container = this.scrollContainers.toArray()[rowIndex];
    if (!container) return;

    const scrollAmount = 400;
    const element = container.nativeElement;

    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }

    setTimeout(() => {
      this.checkScrollButtons();
    }, 300);
  }

  // ✅ فحص ظهور أزرار السكرول
  checkScrollButtons(): void {
    this.scrollContainers.forEach((container, index) => {
      const element = container.nativeElement;
      const canScrollLeft = element.scrollLeft > 0;
      const canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - 10);

      this.showScrollButtons[index] = {
        left: canScrollLeft,
        right: canScrollRight
      };
    });
  }

  // ✅ الانتقال لصفحة فيلم آخر
  goToMovie(id: number): void {
    // Update current movie ID
    this.currentMovieId = id;

    // Navigate to new movie
    this.router.navigate(['/details', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reload movie and recommendations
      this.movieDisplay.language$.subscribe(lang => {
        this.loadMovie(id, lang);
        this.loadRecommendations(id, lang);
      });
    });
  }

  goBack(): void {
    window.history.back();
    setTimeout(() => {
      this.router.navigate([this.router.url], { replaceUrl: true });
    }, 50)
  }



  private getTrailerUrl(videoKey: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoKey}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  scrollLeft(section: string) {
    const scrollElement = this.getScrollElement(section);
    if (scrollElement) {
      scrollElement.nativeElement.scrollBy({ left: -400, behavior: 'smooth' });
    }
  }

  scrollRight(section: string) {
    const scrollElement = this.getScrollElement(section);
    if (scrollElement) {
      scrollElement.nativeElement.scrollBy({ left: 400, behavior: 'smooth' });
    }
  }

  private getScrollElement(section: string): ElementRef | null {
    switch (section) {
      case 'credits': return this.creditsScroll;
      case 'recommendations': return this.recommendationsScroll;
      case 'similar': return this.similarScroll;
      default: return null;
    }
  }

  navigateToMovie(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    // أو لو بتستخدم id بس:
    // this.router.navigate(['/details', movieId]);
  }
  navigateToGroupVideos(type: string) {
  this.router.navigate(['/group-movies', type], { 
    queryParams: { 
      type: type, 
      movieId: this.movie.id 
    } 
  });
}
}