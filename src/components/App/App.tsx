import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { FetchMoviesResp } from '../../types/movie';
import type { Movie } from '../../types/movie';

import styles from './App.module.css';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<FetchMoviesResp, Error>({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery.trim(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    ...( { keepPreviousData: true } as any ),
    // keepPreviousData: true,
    placeholderData: (previousData: FetchMoviesResp | undefined) => previousData,
  });


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

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
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
