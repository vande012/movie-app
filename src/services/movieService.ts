// movieService.ts
import axios, { AxiosError } from 'axios';
import { Movie, StreamingInfo, TMDBMovieResult, TMDBSearchResponse } from '../types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const checkApiKey = () => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured. Please check your .env file.');
  }
};

// Helper function to convert TMDB movie data to our Movie type
const convertTMDBToMovie = (tmdbMovie: TMDBMovieResult): Movie => ({
  id: tmdbMovie.id.toString(),
  title: tmdbMovie.title,
  overview: tmdbMovie.overview || 'No overview available',
  poster_path: tmdbMovie.poster_path || '',
  vote_average: tmdbMovie.vote_average || 0,
  release_date: tmdbMovie.release_date || '',
  director: 'Loading...',
  actors: ['Loading cast information...'],
  trailer_link: '#',
  streaming: []
});

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    checkApiKey();
    
    console.log('🔍 Searching for movie:', query);

    const response = await axios.get<TMDBSearchResponse>(`${BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1,
        include_adult: false
      }
    });

    console.log('📋 Search results:', response.data);

    if (!response.data.results?.length) {
      console.log('⚠️ No results found for query:', query);
      return [];
    }

    const movies: Movie[] = response.data.results
      .slice(0, 1)
      .map(convertTMDBToMovie);

    if (movies.length > 0) {
      const movieWithDetails = await getMovieDetails(movies[0].id);
      movies[0] = { ...movies[0], ...movieWithDetails };
    }

    return movies;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('🚫 API Error Details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          params: axiosError.config?.params
        }
      });
    } else {
      console.error('🚫 Non-Axios error:', error);
    }
    throw new Error(`Failed to search movies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getMovieDetails = async (movieId: string): Promise<Partial<Movie>> => {
  try {
    checkApiKey();
    
    console.log('🎬 Getting details for movie:', movieId);

    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos'
      }
    });

    const data = response.data;
    console.log('📋 Movie details:', data);

    const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Unknown Director';
    const actors = data.credits?.cast?.slice(0, 3).map((actor: any) => actor.name) || ['Cast not available'];
    const trailer = data.videos?.results?.find((video: any) => video.type === 'Trailer');
    const trailerLink = trailer 
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : `https://www.themoviedb.org/movie/${movieId}`;

    const streaming = await getStreamingInfo(movieId);

    return {
      director,
      actors,
      trailer_link: trailerLink,
      streaming
    };

  } catch (error: unknown) {
    console.error('🚫 Error getting movie details:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return {
      director: 'Failed to load',
      actors: ['Failed to load cast'],
      trailer_link: '#',
      streaming: []
    };
  }
};

export const getStreamingInfo = async (movieId: string): Promise<StreamingInfo[]> => {
  try {
    checkApiKey();
    
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/watch/providers`, {
      params: {
        api_key: TMDB_API_KEY,
      }
    });

    return response.data.results?.US?.flatrate?.map((provider: any) => ({
      provider_name: provider.provider_name,
      logo_path: provider.logo_path,
    })) || [];

  } catch (error: unknown) {
    console.error('🚫 Error getting streaming info:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return [];
  }
};