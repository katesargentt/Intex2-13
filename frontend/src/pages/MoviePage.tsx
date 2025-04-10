import React, { useEffect, useState, useRef } from 'react';
import './MoviePage.css';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import MovieDetailModal from '../components/MovieDetailModal';
import GenreSelector from '../components/GenreSelector';
import Footer from '../components/Footer';

interface Movie {
  show_id: string;
  title: string;
  image?: string;
  genre?: string;
}

const IMAGE_URL =
  'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';

const REC_URL =
  'https://intexrecommender-bxeme7cmccahabet.westus-01.azurewebsites.net';

const fallbackUserId = '10';

const popularMovies: Movie[] = [
  { show_id: 's34', title: 'Squid Game' },
  { show_id: 's290', title: 'The Crowned Clown' },
  { show_id: 's110', title: 'La casa de papel' },
  { show_id: 's341', title: 'Inception' },
  { show_id: 's371', title: 'Outer Banks' },
  { show_id: 's6', title: 'Midnight Mass' },
  { show_id: 's83', title: 'Lucifer' },
  { show_id: 's241', title: 'The Witcher: Nightmare of the Wolf' },
  { show_id: 's374', title: 'The Last Mercenary' },
  { show_id: 's854', title: 'Army of the Dead' },
  { show_id: 's139', title: 'Dear John' },
  { show_id: 's179', title: 'The Interview' },
  { show_id: 's585', title: 'Not Another Teen Movie' },
  { show_id: 's1028', title: 'Crimson Peak' },
  { show_id: 's821', title: 'The Platform' },
  { show_id: 's3686', title: 'Stranger Things' },
  { show_id: 's3775', title: 'Black Mirror' },
  { show_id: 's5941', title: 'Breaking Bad' },
  { show_id: 's1960', title: 'Enola Holmes' },
  { show_id: 's2191', title: 'The Umbrella Academy' },
];

const featuredMovie = {
  title: 'Stranger Things 4',
  description:
    'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl. ',
  tagline: 'One summer can change everything.',
  image: 'stzoomedout.webp', // replace with whatever filename you're using
};

const MoviePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const finalUserId = userId || fallbackUserId;

  const [modalShowId, setModalShowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>(
    {}
  );
  const formatGenreName = (genre: string) => {
    return genre
      .replace(/([a-z])([A-Z])/g, '$1 $2') // add space between camelCase
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // split all caps from normal caps
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim(); // trim surrounding whitespace
  };
  const [genreSection, setGenreSection] = useState<{
    genre: string;
    movies: Movie[];
  } | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${REC_URL}/api/recommend/user/${finalUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendedMovies(data.recommended || []);
        setGenreMovies(data.by_genre || {});
      })
      .catch((err) => console.error('Error fetching recommendations:', err));
  }, [finalUserId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    fetch(`${REC_URL}/api/search?q=${encodeURIComponent(searchTerm)}`)
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

  const renderMovieSection = (title: string, movies: Movie[]) => (
    <>
      <h2 className="section-title">{title}</h2>
      <div className="movie-row">
        {movies.map((movie) => (
          <div
            key={movie.show_id}
            className="movie-card"
            onClick={() => setModalShowId(movie.show_id)}
          >
            <img
              src={`${IMAGE_URL}/${encodeURIComponent(
                movie.title.replace(/[^\w\s]/gi, '').trim()
              )}.jpg`}
              alt={movie.title}
              className="movie-poster"
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="top-bar">
        <div className="left-controls">
          {/* 🔍 Search */}
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
                    onClick={() => setModalShowId(movie.show_id)}
                  >
                    <span>{movie.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <GenreSelector
            onSelectGenre={(genre, movies: any) =>
              setGenreSection({ genre, movies })
            }
            onHideGenres={() => setGenreSection(null)}
          />
        </div>

        <Logout>
          Sign Out <AuthorizedUser value="email" />
        </Logout>
      </div>

      <div className="movie-page">
        {genreSection && genreSection.movies.length > 0 && (
          <div className="genre-section">
            {renderMovieSection(
              formatGenreName(genreSection.genre),
              genreSection.movies
            )}
          </div>
        )}
        {/* 🎬 Hero Banner */}
        <div
          className="hero-banner"
          style={{ backgroundImage: `url(/images/${featuredMovie.image})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            {featuredMovie.tagline && (
              <p className="hero-tagline">{featuredMovie.tagline}</p>
            )}
            <p className="hero-description">{featuredMovie.description}</p>

            <div className="hero-buttons">
              <button className="hero-btn">Play</button>
              <button
                className="hero-btn secondary"
                onClick={() => setModalShowId('s3686')}
              >
                More Info
              </button>
            </div>
          </div>
        </div>
        {/* 🌟 Recommended or Popular */}
        {renderMovieSection(
          userId ? 'Recommended for You' : 'Popular Movies',
          userId ? recommendedMovies : popularMovies
        )}
        {/* 🎭 Genre Recommendations */}
        {Object.keys(genreMovies).map((genre) =>
          renderMovieSection(
            `${genre.split(',')[0]} You Might Like`,
            genreMovies[genre]
          )
        )}
        {/* 🎥 Modal */}
        {modalShowId && (
          <MovieDetailModal
            showId={modalShowId}
            onClose={() => setModalShowId(null)}
            onSelect={(newId) => setModalShowId(newId)}
          />
        )}
        <Footer />;
      </div>
    </>
  );
};

export default MoviePage;
