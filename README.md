# Cine-Stream (Movie Explorer)

A **Netflix-lite** movie discovery application built with React and Vite. It uses the TMDB API to show popular movies, supports infinite scroll, debounced search, favorites, and an AI-powered Mood Matcher.

## Features

- Fetch and display popular movies in a responsive CSS grid
- Search movies with debounced input
- Infinite scrolling instead of pagination
- Lazy-loaded posters (`loading="lazy"` on images)
- Favorite movies stored in `localStorage` with a separate view
- AI "Mood Matcher" that suggests a movie based on user mood using OpenAI/Gemini
- Routes powered by React Router
- Custom hooks for data fetching and debouncing

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your API keys:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_key_here
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```
   - Get a TMDB key at https://www.themoviedb.org
   - Get an OpenAI/Gemini key from https://platform.openai.com or your provider

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` (or the port shown in terminal) in your browser.

## Usage

- Type in the search bar to look for movies (requests are debounced).
- Scroll down to load more results automatically.
- Click the heart icon to add/remove favorites; view them via the "My Favorites" link.
- Use the Mood Matcher input to describe how you're feeling (e.g., "sad but want an action movie") and get a recommendation.

## Notes

- This is a frontend-only project. API keys are exposed in the build; use a server proxy for production.
- The Mood Matcher currently calls OpenAI's chat completion endpoint and expects a single movie title.
- <img width="1362" height="683" alt="image" src="https://github.com/user-attachments/assets/8a45b783-02a1-4c5f-b370-5e74945ad7bd" />

