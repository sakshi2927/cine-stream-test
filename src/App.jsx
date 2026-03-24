import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import Favorites from './components/Favorites';
import MoodMatcher from './components/MoodMatcher';
import useDebounce from './hooks/useDebounce';
import useMovies from './hooks/useMovies';
import './App.css';

import { FavoritesProvider } from './context/FavoritesContext';

function Home() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { movies, loading, error, hasMore, loadMore } = useMovies(debouncedQuery);

  const handleMoodResult = (title) => {
    setQuery(title);
  };

  return (
    <>
      <div className="top-bar">
        <SearchBar value={query} onChange={setQuery} />

        <Link to="/favorites" className="fav-link">
          My Favorites
        </Link>
      </div>

      <MoodMatcher onFound={handleMoodResult} />

      {error && (
        <p className="error" role="alert">
          Failed to load movies: {error.message}
        </p>
      )}

      <MovieGrid
        movies={movies}
        loadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
      />
    </>
  );
}

function App() {
  return (
    <FavoritesProvider>   {/* ✅ Context available everywhere */}
      <Router>
        <div className="app">
          <a href='/'>
            <h1 className="logo-text">Cine-Streams</h1>
          </a>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>

        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;