// API helper currently backed by OMDB.
// Function names are kept for compatibility with existing imports.

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const OMDB_API_RAW = import.meta.env.VITE_OMDB_API_KEY;

function getOmdbApiKey() {
  if (!OMDB_API_RAW) {
    throw new Error('Missing OMDB API key. Set VITE_OMDB_API_KEY in .env and restart Vite.');
  }

  const normalized = OMDB_API_RAW.trim();

  // Allow either plain key or a copied URL that already contains `apikey=`.
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    const match = normalized.match(/[?&]apikey=([^&]+)/i);
    if (!match?.[1]) {
      throw new Error('Invalid VITE_OMDB_API_KEY value. Use a plain key or a URL containing apikey=.');
    }
    return match[1];
  }

  return normalized;
}

function mapOmdbSearchToMovies(payload) {
  const items = Array.isArray(payload?.Search) ? payload.Search : [];
  return items.map((item) => ({
    id: item.imdbID,
    title: item.Title,
    poster_path: item.Poster === 'N/A' ? '' : item.Poster,
  }));
}

function buildOmdbResponse(payload, page) {
  const results = mapOmdbSearchToMovies(payload);
  const totalResults = Number(payload?.totalResults || 0);
  const totalPages = Math.max(1, Math.ceil(totalResults / 10));

  return {
    results,
    page,
    total_pages: totalPages,
    total_results: totalResults,
  };
}

async function fetchOmdb(params) {
  const key = getOmdbApiKey();
  const url = `${OMDB_BASE_URL}?apikey=${encodeURIComponent(key)}&type=movie&${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch movies (HTTP ${res.status})`);
  }

  const data = await res.json();
  if (data?.Response === 'False') {
    throw new Error(data?.Error || 'OMDB request failed');
  }

  return data;
}

export async function fetchPopularMovies(page = 1) {
  // OMDB has no "popular" endpoint; use a stable default query.
  const data = await fetchOmdb(`s=${encodeURIComponent('movie')}&page=${page}`);
  return buildOmdbResponse(data, page);
}

export async function searchMovies(query, page = 1) {
  const cleanedQuery = (query || '').trim();
  if (!cleanedQuery) {
    return fetchPopularMovies(page);
  }

  const data = await fetchOmdb(`s=${encodeURIComponent(cleanedQuery)}&page=${page}`);
  return buildOmdbResponse(data, page);
}

export function getPosterUrl(path) {
  if (!path || path === 'N/A') return '';
  return path;
}
