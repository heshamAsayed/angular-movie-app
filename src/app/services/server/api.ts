import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// ✅ الميثودات المهمة مغطاة بالكامل:
// getPopularMovies() → الأفلام الشائعة / trending
// getNowPlayingMovies() → الأفلام الحالية في السينما
// getMovieByIdWithVideos() → جلب التفاصيل + فيديوهات في طلب واحد
// getMovieRecommendations() → توصيات لفيلم
// searchMoviesByTitle() → البحث حسب العنوان
// getGenres() → جلب التصنيفات
// discoverMovies() → فلترة وتصنيف حسب الـ API
// getMovieVideos() → الفيديوهات بشكل منفصل

export class API {

  private apiKey = '92e1011b82e7b4f98f14eea8d946d703';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  // ==============================
  // Get popular movies with language support
  // ==============================
  getPopularMovies(page: number = 1, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/popular`, { params });
  }

  // ==============================
  // Get now playing movies
  // ==============================
  getNowPlayingMovies(page: number = 1, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/now_playing`, { params });
  }

  // ==============================
  // Get movie details by ID with videos
  // ==============================
  getMovieByIdWithVideos(id: number, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language)
      .set('append_to_response', 'videos');
    return this.http.get(`${this.baseUrl}/movie/${id}`, { params });
  }

  // ==============================
  // Get movie recommendations
  // ==============================
  getMovieRecommendations(id: number, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/${id}/recommendations`, { params });
  }

  // ==============================
  // Search movies by title
  // ==============================
  searchMoviesByTitle(title: string, page: number = 1, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', title)
      .set('page', page.toString())
      .set('language', language);
    return this.http.get(`${this.baseUrl}/search/movie`, { params });
  }

  // ==============================
  // Get movie genres
  // ==============================
  getGenres(language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language);
    return this.http.get(`${this.baseUrl}/genre/movie/list`, { params });
  }

  // ==============================
  // Discover movies (filter & sort)
  // ==============================
  discoverMovies(filters: any = {}, language: string = 'en'): Observable<any> {
    let params = new HttpParams().set('api_key', this.apiKey).set('language', language);
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
    return this.http.get(`${this.baseUrl}/discover/movie`, { params });
  }

  // ==============================
  // Get movie videos separately
  // ==============================
  getMovieVideos(id: number, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/${id}/videos`, { params });
  }

  //Top Rated Movies
  getTopRatedMovies(page: number = 1, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/top_rated`, { params });
  }

  //Upcoming Movies
  getUpcomingMovies(page: number = 1, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/upcoming`, { params });
  }




  //  in Details for moive 
  //Movie Credits (Cast & Crew)
  getMovieCredits(id: number, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/${id}/credits`, { params });
  }


  //Similar Movies
  getSimilarMovies(id: number, language: string = 'en'): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', language);
    return this.http.get(`${this.baseUrl}/movie/${id}/similar`, { params });
  }


  // get TMDB configuration (base image urls + sizes)
getConfiguration(): Observable<any> {
  const params = new HttpParams().set('api_key', this.apiKey);
  return this.http.get(`${this.baseUrl}/configuration`, { params });
}

// watch/providers
getMovieWatchProviders(id: number, language: string = 'en'): Observable<any> {
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('language', language);
  return this.http.get(`${this.baseUrl}/movie/${id}/watch/providers`, { params });
}

// person details (useful when user clicks actor)
getPersonDetails(personId: number, language: string = 'en'): Observable<any> {
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('language', language);
  return this.http.get(`${this.baseUrl}/person/${personId}`, { params });
}

// person images (profiles)
getPersonImages(personId: number): Observable<any> {
  const params = new HttpParams().set('api_key', this.apiKey);
  return this.http.get(`${this.baseUrl}/person/${personId}/images`, { params });
}

// movie reviews (for showing snippet under details)
getMovieReviews(id: number, page: number = 1, language: string = 'en'): Observable<any> {
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('page', page.toString())
    .set('language', language);
  return this.http.get(`${this.baseUrl}/movie/${id}/reviews`, { params });
}

// movie external ids (imdb_id etc)
getMovieExternalIds(id: number): Observable<any> {
  const params = new HttpParams().set('api_key', this.apiKey);
  return this.http.get(`${this.baseUrl}/movie/${id}/external_ids`, { params });
}

// convenience: full details in one request (append_to_response)
getMovieFullDetailsWithAppend(id: number, language: string = 'en'): Observable<any> {
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('language', language)
    .set('append_to_response', 'videos,credits,recommendations,similar,images');
  return this.http.get(`${this.baseUrl}/movie/${id}`, { params });
}

}
