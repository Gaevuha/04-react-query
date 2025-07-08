// src/components/App/App.tsx
import { useState, useEffect } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const [data, setData] = useState<{ results: Movie[]; total_pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasError(false);

    fetchMovies(searchQuery, page)
      .then(response => {
        if (response.results.length === 0) {
          toast.error('No movies found for your request.');
          setData(null);
        } else {
          setData(response);
        }
      })
      .catch(() => {
        setHasError(true);
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery, page]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error('Please enter a search query.');
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}

      {/* Якщо сталася HTTP‑помилка — показуємо ErrorMessage */}
      {hasError && <ErrorMessage />}

      {/* Інакше, якщо є дані — показуємо пагінацію + галерею */}
      {!isLoading && !hasError && data && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleMovieClick} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
