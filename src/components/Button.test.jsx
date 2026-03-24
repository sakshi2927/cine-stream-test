import React from 'react';
import { render, screen } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';
import { FavoritesContext } from '../context/FavoritesContext';

const movie = {
  id: 101,
  title: 'Interstellar',
  poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
};

const notFavoritedContext = {
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorited: jest.fn(() => false),
};

const favoritedContext = {
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorited: jest.fn(() => true),
};

describe('Button Component', () => {
  it('renders without crashing', () => {
    render(
      <FavoritesContext.Provider value={notFavoritedContext}>
        <FavoriteButton movie={movie} />
      </FavoritesContext.Provider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows add text when movie is not favorited', () => {
    render(
      <FavoritesContext.Provider value={notFavoritedContext}>
        <FavoriteButton movie={movie} />
      </FavoritesContext.Provider>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Add to Favorites');
  });

  it('shows remove text when movie is favorited', () => {
    render(
      <FavoritesContext.Provider value={favoritedContext}>
        <FavoriteButton movie={movie} />
      </FavoritesContext.Provider>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Remove');
  });
});
