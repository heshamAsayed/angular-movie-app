import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieDisplay } from '../../services/Display/movie-display';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { Movie } from '../../models/Movie/movie-module';
import { Genre } from '../../models/genre/genre-module';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details implements OnInit {
  movie: Movie | null = null; // Use Movie interface
  isLoading = false;
  trailerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieDisplay: MovieDisplay,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  ngOnInit(): void {
    // ✅ Get movie ID from route parameters
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    // ✅ Redirect to movies list if ID is not available
    if (!id) {
      this.router.navigate(['/movies']);
      return;
    }

    // ✅ Subscribe to language changes and reload movie on language change
    this.movieDisplay.language$.subscribe(lang => {
      this.loadMovie(id, lang);
    });
  }

  /** Load movie details from MovieDisplay service */
  private loadMovie(id: number, lang: string): void {
    this.isLoading = true;

    this.movieDisplay.getMovieByIdWithVideos(id, lang).subscribe({
      next: (res: Movie) => {
        this.movie = res;

        // ✅ Set trailer URL if YouTube video is available
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

  /** Navigate back to previous page */
  goBack(): void {
    this.location.back();
  }

  /** Convert video key to SafeResourceUrl for embedding */
  private getTrailerUrl(videoKey: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoKey}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
