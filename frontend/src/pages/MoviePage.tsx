import React, { useEffect, useState, useRef } from 'react';
import './MoviePage.css';
import {
  useParams,
  useNavigate,
  useLocation,
  Routes,
  Route,
} from 'react-router-dom';
import { Search } from 'lucide-react';
import DetailPage from './DetailPage';
import { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
interface Movie {
  show_id: string;
  title: string;
  image: string;
  genre: string;
}

const IMAGE_URL =
  'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';
const MoviePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>(
    {}
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const featuredMovie = {
    title: 'We Live in Time',
    description:
      'A heartwarming romance that unfolds over decades, revealing the beauty and pain of love.',
    image: 'WE.jpg',
  };
  useEffect(() => {
    fetch(`http://localhost:5002/api/recommend/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendedMovies(data.recommended || []);
        setGenreMovies(data.by_genre || {});
      })
      .catch((err) => console.error('Error fetching recommendations:', err));
  }, [userId]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    fetch(
      `http://localhost:5002/api/search?q=${encodeURIComponent(searchTerm)}`
    )
      .then((res) => res.json())
      .then((data) => setSearchResults(data))
      .catch((err) => console.error('Search error:', err));
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setSearchResults([]);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if (!userId) {
    return (
      <div className="movie-page">
        <span>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
        </span>
        <h2 className="section-title">Recommended for you</h2>
        <p style={{ color: 'white', textAlign: 'center' }}>
          No recommendations found for user {userId}, or something went wrong.
        </p>
      </div>
    );
  }
  return (
    <>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <div className="movie-page">
        {/* :mag: Search Section */}
        <div className="search-wrapper" ref={searchRef}>
          <button
            className="search-icon-btn"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <Search size={22} color="white" />
          </button>
          {showSearch && (
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
                autoFocus
              />
            </form>
          )}
          {searchResults.length > 0 && (
            <div className="search-dropdown wide">
              {searchResults.map((movie) => (
                <div
                  key={movie.show_id}
                  className="search-item"
                  onClick={() =>
                    navigate(`/details/${movie.show_id}`, {
                      state: { backgroundLocation: location },
                    })
                  }
                >
                  <img
                    src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* :clapper: Featured Movie */}
        <div
          className="hero-banner"
          style={{ backgroundImage: `url(/images/${featuredMovie.image})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-buttons">
              <button className="hero-btn">Play</button>
              <button className="hero-btn secondary">More Info</button>
            </div>
          </div>
        </div>
        {/* :star: Top Recommendations */}
        <h2 className="section-title">Recommended for you</h2>
        <div className="movie-row">
          {recommendedMovies.map((movie) => (
            <div key={movie.show_id} className="movie-card">
              <img
                src={`${IMAGE_URL}/${encodeURIComponent(movie.title.trim())}.jpg`}
                alt={movie.title}
                className="movie-poster"
              />
              <p className="movie-title">{movie.title}</p>
            </div>
          ))}
        </div>
        {/* :performing_arts: Genre Rows */}
        {Object.keys(genreMovies).map((genre) => (
          <div key={genre}>
            <h2 className="section-title">
              {genre.split(',')[0]} You Might Like
            </h2>
            <div className="movie-row">
              {genreMovies[genre].map((movie) => (
                <div key={movie.show_id} className="movie-card">
                  <img
                    src={`${IMAGE_URL}/${encodeURIComponent(movie.title.trim())}.jpg`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <p className="movie-title">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Modal DetailPage rendering */}
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/details/:showId"
              element={
                <div className="modal-backdrop">
                  <div className="modal-container">
                    <DetailPage />
                  </div>
                </div>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};
export default MoviePage;
