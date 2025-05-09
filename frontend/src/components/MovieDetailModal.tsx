//Movie detail page. Shows to the user when they click on a movie to show the details
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import '../pages/DetailPage.css';

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'https://localhost:5000/api/Movie'
    : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net/api/Movie';

const IMAGE_URL =
  'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';

const REC_URL =
  'https://intexrecommender-bxeme7cmccahabet.westus-01.azurewebsites.net';
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

  
  const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'https://localhost:5000'
    : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net';

  const handleRating = async (rating: number) => {
    setUserRating(rating);
  //error handling
    try {
      await fetch(`${BASE_URL}/api/Rating`, {
        method: 'POST',
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
    fetch(`${BASE_URL}/api/Rating/${showId}`, {
      credentials: 'include',
    })

    //error handling
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load rating');
        return res.json();
      })
      .then((data) => {
        setUserRating(data.rating ?? 0);
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

  //load the recommendations based on the selected movie
  useEffect(() => {
    fetch(`${REC_URL}/api/recommend/hybrid/${showId}`)
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

  //returns the modal that pops up above the MoviePage that allows a logged in user to view the movie details, rate that movie,
  //and navigate to other recommended movies
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
            {/* allows the user to rate a movie 1-5 stars. Saves the rating to the movie_rating database */}
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

        {/* shows the recommended movies and allows the user to navigate to other movie details */}
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
