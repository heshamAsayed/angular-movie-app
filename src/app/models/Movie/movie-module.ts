// movie.model.ts
export interface Video {
  site: string;
  key: string;
  name: string;
}

export interface Videos {
  results: Video[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  popularity?: number; 
  adult?: boolean;
  videos?: Videos; 
}