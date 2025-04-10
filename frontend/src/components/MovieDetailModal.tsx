import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import '../pages/DetailPage.css';

const API_URL = 'https://localhost:5000/api/Movie';
const IMAGE_URL =
  'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';

interface Props {
  showId: string;
  onClose: () => void;
  onSelect: (showId: string) => void;
}

const MovieDetailModal: React.FC<Props> = ({ showId, onClose, onSelect }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [imageError, setImageError] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const [userRating, setUserRating] = useState<number>(0);

  const handleRating = async (rating: number) => {
    setUserRating(rating);

    try {
      await fetch(`https://localhost:5000/api/Rating`, {
        method: 'POST', // or PUT if you prefer
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showId: showId,
          rating: rating,
        }),
      });
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  useEffect(() => {
    fetch(`https://localhost:5000/api/Rating/${showId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load rating');
        return res.json();
      })
      .then((data) => {
        setUserRating(data.rating ?? 0); // 👈 fallback to 0 if null
      })
      .catch((err) => {
        console.log('No previous rating or error fetching rating:', err);
        setUserRating(0);
      });
  }, [showId]);

  useEffect(() => {
    setMovie(null);
    setImageError(false);

    fetch(`${API_URL}/${showId}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setMovie)
      .catch((err) => console.error('Error loading movie:', err));
  }, [showId]);

  useEffect(() => {
    fetch(`http://localhost:5002/api/recommend/hybrid/${showId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('RECOMMENDATIONS DATA:', data);
        const normalized = data.map((rec: any) => ({
          ...rec,
          showId: rec.show_id, // Normalize
        }));
        setRecommendations(normalized);
      })
      .catch((err) => console.error('Error fetching recommendations:', err));
  }, [showId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="detail-container">
          {!imageError ? (
            <img
              src={`${IMAGE_URL}/${encodeURIComponent(
                movie.title.replace(/[^\w\s]/gi, '').trim()
              )}.jpg`}
              alt={movie.title}
              className="poster-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="poster-fallback">{movie.title}</div>
          )}

          <div className="movie-details">
            <h1>{movie.title}</h1>
            <p className="description">{movie.description}</p>
            <p>
              <strong>Year:</strong> {movie.releaseYear}
            </p>
            <p>
              <strong>Duration:</strong> {movie.duration}
            </p>
            <p>
              <strong>Rating:</strong> {movie.rating}
            </p>
            <p>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>
              <strong>Cast:</strong> {movie.cast}
            </p>
            <p>
              <strong>Country:</strong> {movie.country}
            </p>
            <p>
              <strong>Genres:</strong> {movie.categories?.join(', ') || 'N/A'}
            </p>
            <div className="rating-section">
              <strong>Rate:</strong>{' '}
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= userRating ? 'filled' : ''}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <h4 className="movie-detail-recommendation-title">
          If you liked {movie.title}...
        </h4>
        <div className="recommendation-row">
          {recommendations.map((rec, i) => (
            <div
              key={rec.showId ?? `rec-${i}`}
              className="recommendation-card"
              onClick={() => onSelect(rec.showId)}
              style={{ cursor: 'pointer' }}
            >
              {!imgErrorMap[rec.showId] ? (
                <img
                  src={`${IMAGE_URL}/${encodeURIComponent(
                    rec.title.replace(/[^\w\s]/gi, '').trim()
                  )}.jpg`}
                  alt={rec.title}
                  className="recommendation-image"
                  onError={() =>
                    setImgErrorMap((prev) => ({ ...prev, [rec.showId]: true }))
                  }
                />
              ) : (
                <div className="recommendation-fallback">{rec.title}</div>
              )}
              <p className="recommendation-title">{rec.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
