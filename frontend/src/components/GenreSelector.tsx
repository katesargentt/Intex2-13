//genre selecter component. Allows the user to filter by genre
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

  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? 'https://localhost:5000'
      : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net';

  useEffect(() => {
    if (showGenres && genres.length === 0) {
      setLoading(true);
      setError('');
      fetch(`${BASE_URL}/api/Movie/GetMovieGenres`, {
        credentials: 'include',
      })
      //error handling
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

  //shows the genre buttons when user clicks
  const handleGenreClick = (genre: string) => {
    fetch(
      `${BASE_URL}/api/Movie/GetMoviesByGenre/${encodeURIComponent(genre)}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((movies) => {
        const normalized = movies.map((m: any) => ({
          show_id: m.showId ?? m.show_id,
          title: m.title,
        }));
        onSelectGenre(genre, normalized);
      })
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

  //lets user select genre, shows the movies, and allows the user to click on a filtered movie to see the details
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
