export interface StreamingInfo {
  provider_name: string;
  logo_path: string;
}

export interface Movie {
  id: string;           // Changed from number to string to be consistent
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  vote_count: number;
  genres?: string[];
  runtime?: number;
  director: string;
  actors: string[];
  trailer_link: string;
  streaming?: {
    provider_name: string;
    logo_path: string;
  }[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

// Additional type definitions for API responses
export interface TMDBMovieResult {
  id: number;           // TMDB API returns id as number
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface TMDBSearchResponse {
  results: TMDBMovieResult[];
  page: number;
  total_pages: number;
  total_results: number;
}