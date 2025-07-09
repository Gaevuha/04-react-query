import axios from 'axios';
import type { Movie } from '../types/movie';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

export interface FetchMoviesResp {
  results: Movie[];
  total_pages: number;
}

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;
if (!ACCESS_TOKEN) {
  throw new Error('TMDB API key is missing');
}

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<FetchMoviesResp> => {
  const response = await axios.get<FetchMoviesResp>('/search/movie', {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};


