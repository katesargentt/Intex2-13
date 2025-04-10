import React, { useEffect, useState } from 'react';
import './GenreSelector.css';

interface Movie {
  showId: string;
  title: string;
}

interface GenreSelectorProps {
  onSelectGenre: (genre: string, movies: Movie[]) => void;
  onHideGenres: () => void; // ✅ NEW PROP
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  onSelectGenre,
  onHideGenres,
}) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showGenres && genres.length === 0) {
      setLoading(true);
      setError('');
      fetch('https://localhost:5000/api/Movie/GetMovieGenres', {
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then(setGenres)
        .catch((err) => {
          console.error('❌ Failed to fetch genres:', err);
          setError('Could not load genres');
        })
        .finally(() => setLoading(false));
    }
  }, [showGenres]);

  const handleGenreClick = (genre: string) => {
    fetch(
      `https://localhost:5000/api/Movie/GetMoviesByGenre/${encodeURIComponent(genre)}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((movies) => onSelectGenre(genre, movies))
      .catch((err) => {
        console.error('❌ Failed to fetch movies by genre:', err);
      });
  };

  const formatGenreName = (genre: string) => {
    return genre
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z])(\d)/gi, '$1 $2')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const toggleGenres = () => {
    if (showGenres) {
      onHideGenres(); // ✅ Clear carousel when hiding genres
    }
    setShowGenres(!showGenres);
  };

  return (
    <div className="genre-selector">
      <button onClick={toggleGenres} className="genre-toggle">
        {showGenres ? 'Hide Genres' : 'Browse by Genre'}
      </button>

      {showGenres && (
        <div className="genre-list">
          {loading && <p>Loading genres...</p>}
          {error && <p className="error">{error}</p>}
          {!loading &&
            genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className="genre-button"
              >
                {formatGenreName(genre)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default GenreSelector;
