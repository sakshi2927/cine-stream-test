export async function fetchPopularMovies(page = 1) {
  return {
    results: [],
    total_pages: 1,
  };
}

export async function searchMovies(query, page = 1) {
  return {
    results: [],
    total_pages: 1,
  };
}

export function getPosterUrl(path, size = 'w342') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
}
