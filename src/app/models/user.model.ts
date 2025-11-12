export interface User {
  uid?: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  profileImage: string | null;
  watchlist: WatchlistItem[] | null;
  createdAt: number;
  lastLogin?: number;
}

export interface WatchlistItem {
  movieId: string;
  title: string;
  poster: string;
  addedAt: number;
  releaseDate: string;
  rating: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}
