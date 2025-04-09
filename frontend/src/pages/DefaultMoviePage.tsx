import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { useParams } from 'react-router-dom';

interface Movie {
  show_id: string;
  title: string;
  genre?: string;
}

const IMAGE_URL =
  'https://cinenicheimages.blob.core.windows.net/movieposters/Movie Posters/Movie Posters';

const fallbackUserId = '10'; // 💡 <-- hardcoded fallback user ID here

const popularMovies = [
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
  title: 'We Live in Time',
  description: 'A heartwarming romance that unfolds over decades.',
  image: 'WE.jpg',
};

const MoviePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>(
    {}
  );

  const finalUserId = userId || fallbackUserId;

  useEffect(() => {
    fetch(`http://localhost:5002/api/recommend/user/${finalUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRecommendedMovies(data.recommended || []);
        setGenreMovies(data.by_genre || {});
      })
      .catch((err) => console.error('Error fetching recommendations:', err));
  }, [finalUserId]);

  const renderMovieSection = (title: string, movies: Movie[]) => (
    <div key={title}>
      <h2 className="section-title">{title}</h2>
      <div className="movie-row">
        {movies.map((movie) => (
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
  );

  return (
    <div className="movie-page">
      <div
        className="hero-banner"
        style={{
          backgroundImage: `url("/images/${featuredMovie.image}")`,
        }}
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

      {/* Only show recommended section if a real userId was passed */}
      {userId
        ? renderMovieSection('Recommended for You', recommendedMovies)
        : renderMovieSection('Popular Movies', popularMovies)}

      {/* Genre sections show regardless of userId */}
      {Object.keys(genreMovies).map((genre) =>
        renderMovieSection(
          `${genre.split(',')[0].trim()} Movies You Might Like`,
          genreMovies[genre]
        )
      )}
    </div>
  );
};

export default MoviePage;
