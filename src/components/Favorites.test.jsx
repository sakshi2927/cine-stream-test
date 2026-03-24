import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Favorites from './Favorites';
import { FavoritesContext } from '../context/FavoritesContext';

const mockFavorites = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    poster_path: '/28cpzEQMsVmqfuMbMXMymw2IoWD.jpg',
  },
  {
    id: 2,
    title: 'The Godfather',
    poster_path: '/3bhkrj58Vtu7enYsRolD1cjexSK.jpg',
  },
];

const mockContextValue = {
  favorites: mockFavorites,
  isFavorited: jest.fn((id) => true),
  removeFromFavorites: jest.fn(),
};

const mockEmptyContextValue = {
  favorites: [],
  isFavorited: jest.fn(),
  removeFromFavorites: jest.fn(),
};

describe('Favorites Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <FavoritesContext.Provider value={mockContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    expect(screen.getByText('← Back')).toBeInTheDocument();
  });

  it('displays empty message when no favorites', () => {
    render(
      <Router>
        <FavoritesContext.Provider value={mockEmptyContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    expect(screen.getByText('No favorites yet. ❤️')).toBeInTheDocument();
  });

  it('displays all favorited movies', () => {
    render(
      <Router>
        <FavoritesContext.Provider value={mockContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
    expect(screen.getByText('The Godfather')).toBeInTheDocument();
  });

  it('shows back link', () => {
    render(
      <Router>
        <FavoritesContext.Provider value={mockContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    const backLink = screen.getByText('← Back');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders grid layout with favorites', () => {
    const { container } = render(
      <Router>
        <FavoritesContext.Provider value={mockContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('renders correct number of movie cards for favorites', () => {
    render(
      <Router>
        <FavoritesContext.Provider value={mockContextValue}>
          <Favorites />
        </FavoritesContext.Provider>
      </Router>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(mockFavorites.length);
  });
});
