import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieGrid from './MovieGrid';
import * as favoritesHook from '../hooks/useFavorites';

jest.mock('./MovieCard', () => {
  return function MockMovieCard({ movie }) {
    return <div data-testid="movie-card">{movie.title}</div>;
  };
});

const mockMovies = [
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

const mockUseFavoritesReturn = {
  favorites: [],
  isFavorite: jest.fn(() => false),
  toggleFavorite: jest.fn(),
};

describe('MovieGrid Component', () => {
  beforeEach(() => {
    jest.spyOn(favoritesHook, 'default').mockReturnValue(mockUseFavoritesReturn);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
  });

  it('displays all movies', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
    expect(screen.getByText('The Godfather')).toBeInTheDocument();
  });

  it('displays loading message when loading', () => {
    render(
      <MovieGrid
        movies={[]}
        loadMore={jest.fn()}
        hasMore={true}
        loading={true}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays empty message when no movies found', () => {
    render(
      <MovieGrid
        movies={[]}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    expect(screen.getByText('No movies found.')).toBeInTheDocument();
  });

  it('renders correct number of movie cards', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    const movieCards = screen.getAllByTestId('movie-card');
    expect(movieCards).toHaveLength(mockMovies.length);
  });

  it('applies grid CSS class', () => {
    const { container } = render(
      <MovieGrid
        movies={mockMovies}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('shows empty message with correct CSS class', () => {
    const { container } = render(
      <MovieGrid
        movies={[]}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    expect(container.querySelector('.empty-msg')).toBeInTheDocument();
  });

  it('displays movies with their images', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        loadMore={jest.fn()}
        hasMore={false}
        loading={false}
      />
    );
    const movieCards = screen.getAllByTestId('movie-card');
    expect(movieCards).toHaveLength(mockMovies.length);
    expect(movieCards[0]).toHaveTextContent('The Shawshank Redemption');
    expect(movieCards[1]).toHaveTextContent('The Godfather');
  });
});
