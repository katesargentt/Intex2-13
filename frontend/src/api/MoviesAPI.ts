import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  movies: Movie[];
  totalNumMovies: number;
}

//const API_URL =
//'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net/api/Movie'; //api url
const API_URL = 
  import.meta.env.MODE === 'development'
    ? 'https://localhost:5000/api/Movie'
    : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net/api/Movie';

// ✅ Fetch movies with optional filtering by category
export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse | undefined> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `movieTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/AllMovies?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      {
        method: 'GET',
        credentials: 'include', // 🔥 Important for cookies/sessions
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const result = await response.json();

    console.log('Fetched response from backend:', result);

    return {
      movies: result.movies,
      totalNumMovies: result.totalNumMovies,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return undefined;
  }
};

// ✅ Add a new movie
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      credentials: 'include', // 👈 only if cookies/session auth are used
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend responded with:', response.status, errorText);
      throw new Error('Failed to add movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// ✅ Update an existing movie
export const updateMovie = async (
  showId: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      method: 'PUT',
      credentials: 'include', // ✅ only needed for cookie-based/session auth
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      throw new Error('Failed to update movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// ✅ Delete a movie
export const deleteMovie = async (showId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${showId}`, {
      method: 'DELETE',
      credentials: 'include', // 👈 only if you need cookie/session auth
    });

    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};
