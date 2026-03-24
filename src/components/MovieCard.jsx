import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="28" font-family="Arial, sans-serif">No Poster</text></svg>';

const getMoviePosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return FALLBACK_POSTER;
  if (posterPath === 'N/A') return FALLBACK_POSTER;
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) {
    return posterPath;
  }
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorited } = useContext(FavoritesContext);
  const favorited = isFavorited(movie.id);
  const posterSrc = getMoviePosterUrl(movie?.poster_path, 'w500');

  const handleFavoriteClick = () => {
    if (favorited) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="movie-card">
      <img
        src={posterSrc}
        alt={movie?.title || 'Movie poster'}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_POSTER;
        }}
      />

      <h3>{movie.title}</h3>

      <button
        onClick={handleFavoriteClick}
        className={`favorite-btn ${favorited ? 'active' : ''}`}
      >
        {favorited ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default MovieCard;