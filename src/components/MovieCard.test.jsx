import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieCard from './MovieCard';
import { FavoritesContext } from '../context/FavoritesContext';

const mockMovie = {
  id: 1,
  title: 'The Shawshank Redemption',
  poster_path: '/28cpzEQMsVmqfuMbMXMymw2IoWD.jpg',
};

const mockContextValue = {
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorited: jest.fn((id) => false),
};

const mockContextValueWithFavorited = {
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorited: jest.fn((id) => id === 1),
};

describe('MovieCard Component', () => {
  it('renders without crashing', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <MovieCard movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
  });

  it('displays movie title from props', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <MovieCard movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
  });

  it('displays movie poster src and alt from props', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <MovieCard movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    const img = screen.getByAltText('The Shawshank Redemption');
    expect(img).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/28cpzEQMsVmqfuMbMXMymw2IoWD.jpg'
    );
  });

  it('displays not-favorited button text', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <MovieCard movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('🤍');
  });

  it('displays favorited button text', () => {
    render(
      <FavoritesContext.Provider value={mockContextValueWithFavorited}>
        <MovieCard movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('❤️');
  });
});
