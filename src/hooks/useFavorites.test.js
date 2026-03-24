import { renderHook, act } from '@testing-library/react';
import useFavorites from './useFavorites';

const mockMovie = {
  id: 1,
  title: 'The Shawshank Redemption',
  poster_path: '/28cpzEQMsVmqfuMbMXMymw2IoWD.jpg',
};

const mockMovie2 = {
  id: 2,
  title: 'The Godfather',
  poster_path: '/3bhkrj58Vtu7enYsRolD1cjexSK.jpg',
};

describe('useFavorites Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it('adds a movie to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.favorites).toContainEqual(mockMovie);
    expect(result.current.favorites).toHaveLength(1);
  });

  it('checks if a movie is favorited', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    const isFav = result.current.isFavorite(mockMovie);
    expect(isFav).toBe(true);
  });

  it('removes a favorite movie', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('toggles between adding and removing', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.isFavorite(mockMovie)).toBe(true);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.isFavorite(mockMovie)).toBe(false);
  });

  it('handles multiple favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
      result.current.toggleFavorite(mockMovie2);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(mockMovie)).toBe(true);
    expect(result.current.isFavorite(mockMovie2)).toBe(true);
  });

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    const stored = localStorage.getItem('favorites');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored)).toEqual([mockMovie]);
  });

  it('loads favorites from localStorage on mount', () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([mockMovie]);
  });

  it('returns correct isFavorite status', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite(mockMovie)).toBe(false);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.isFavorite(mockMovie)).toBe(true);
  });
});
