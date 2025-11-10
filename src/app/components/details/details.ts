import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { API } from '../../services/server/api';
import { MovieDisplay } from '../../services/Display/movie-display';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatCardModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details implements OnInit {
  movie: any = null;
  isLoading = false;
  trailerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: API,
    private movieDisplay: MovieDisplay,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}
  

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (!id) {
      // no id — go back to movies
      this.router.navigate(['/movies']);
      return;
    }

    this.isLoading = true;
    // Try to use the app language if available via MovieDisplay
    // MovieDisplay exposes language$ as observable; fall back to API default when not available
    this.api.getMovieByIdWithVideos(id).subscribe({
      next: (res) => {
        this.movie = res;
        // Set trailer URL if available
        if (res.videos?.results?.length && res.videos.results[0]?.site === 'YouTube') {
          this.trailerUrl = this.getTrailerUrl(res.videos.results[0].key);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/movies']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/movies']);
  }

  private getTrailerUrl(videoKey: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoKey}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

