import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from './FavoriteButton';
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

describe('FavoriteButton Component', () => {
  it('renders without crashing', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays empty heart when not favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('🤍');
  });

  it('displays filled heart when favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValueWithFavorited}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('❤️');
  });

  it('displays "Add to Favorites" text when not favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Add to Favorites');
  });

  it('displays "Remove" text when favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValueWithFavorited}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Remove');
  });

  it('calls addToFavorites when clicking unfavorited button', async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn();
    const contextValue = {
      ...mockContextValue,
      addToFavorites: mockAdd,
    };

    render(
      <FavoritesContext.Provider value={contextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockAdd).toHaveBeenCalledWith(mockMovie);
  });

  it('calls removeFromFavorites when clicking favorited button', async () => {
    const user = userEvent.setup();
    const mockRemove = jest.fn();
    const contextValue = {
      ...mockContextValueWithFavorited,
      removeFromFavorites: mockRemove,
    };

    render(
      <FavoritesContext.Provider value={contextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('has correct active class when favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValueWithFavorited}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    expect(screen.getByRole('button')).toHaveClass('favorite-btn', 'active');
  });

  it('does not have active class when not favorited', () => {
    render(
      <FavoritesContext.Provider value={mockContextValue}>
        <FavoriteButton movie={mockMovie} />
      </FavoritesContext.Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('favorite-btn');
    expect(button).not.toHaveClass('active');
  });
});
