import { renderHook, waitFor } from '@testing-library/react';
import useMovies from './useMovies';

jest.mock('../api/tmdb', () => ({
  fetchPopularMovies: jest.fn((page = 1) =>
    fetch(`/mock/popular?page=${page}`).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch popular movies');
      }
      return res.json();
    })
  ),
  searchMovies: jest.fn((query, page = 1) =>
    fetch(`/mock/search?query=${encodeURIComponent(query)}&page=${page}`).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to search movies');
      }
      return res.json();
    })
  ),
}));

describe('API fetching - useMovies', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state while API request is pending', async () => {
    let resolveFetch;
    const pendingFetch = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch.mockReturnValueOnce(pendingFetch);

    const { result } = renderHook(() => useMovies(''));

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);

    resolveFetch({
      ok: true,
      json: async () => ({
        results: [{ id: 1, title: 'Inception', poster_path: '/inception.jpg' }],
        total_pages: 2,
      }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles successful API response and sets movies', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 101, title: 'Interstellar', poster_path: '/interstellar.jpg' },
          { id: 102, title: 'Dune', poster_path: '/dune.jpg' },
        ],
        total_pages: 3,
      }),
    });

    const { result } = renderHook(() => useMovies(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe(null);
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.movies[0].title).toBe('Interstellar');
    expect(result.current.hasMore).toBe(true);
  });

  it('handles API error state on failed request', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Request failed' }),
    });

    const { result } = renderHook(() => useMovies(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });
});
