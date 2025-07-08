import styles from './SearchBar.module.css';
import toast, { Toaster } from 'react-hot-toast';
import React, { FormEvent } from 'react';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки

    const formData = new FormData(event.currentTarget);
    const query = (formData.get("query") as string)?.trim();

    if (!query) {
      toast.error("Please enter your search query.");
      return;
    }
    onSubmit(query);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
      <Toaster position="top-center" />
    </header>
  );
}
