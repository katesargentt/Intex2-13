import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { useParams } from 'react-router-dom';

interface Movie {
  show_id: string;
  title: string;
  image: string;
  genre: string; // Added genre to the Movie interface
}

const MoviePage: React.FC = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  console.log('User ID from params:', userId);

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>(
    {}
  );

  const featuredMovie = {
    title: 'We Live in Time',
    description:
      'A heartwarming romance that unfolds over decades, revealing the beauty and pain of love.',
    image: 'WE.jpg',
  };

  console.log('📺 MoviePage loaded');

  useEffect(() => {
    console.log(`🎯 Fetching recommendations for user ${userId}`);
    fetch(`http://localhost:5002/api/recommend/user/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Recommendations fetched:', data);

        const genres: { [key: string]: Movie[] } = {};
        data.forEach((movie: Movie) => {
          if (!genres[movie.genre]) genres[movie.genre] = [];
          genres[movie.genre].push(movie);
        });

        setRecommendedMovies(data);
        setGenreMovies(genres);
      })
      .catch((err) => {
        console.error('❌ Error fetching recommendations:', err);
      });
  }, [userId]);

  if (recommendedMovies.length === 0 && Object.keys(genreMovies).length === 0) {
    return (
      <div className="movie-page">
        <h2 className="section-title">Recommended for you</h2>
        <p style={{ color: 'white', textAlign: 'center' }}>
          No recommendations found for user {userId}, or something went wrong.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-page">
      {/* ✅ HERO SECTION */}
      <div
        className="hero-banner"
        style={{
          backgroundImage: `url(/images/${featuredMovie.image})`,
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

      {/* ✅ TOP RECOMMENDATIONS SECTION */}
      <h2 className="section-title">Recommended for you</h2>
      <div className="movie-row">
        {recommendedMovies.map((movie) => (
          <div key={movie.show_id} className="movie-card">
            <img
              src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
              alt={movie.title}
              className="movie-poster"
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      {/* ✅ GENRE SECTIONS */}
      {Object.keys(genreMovies).map((genre) => (
        <div key={genre}>
          <h2 className="section-title">
            {genre.split(',')[0].trim()} Movies You Might Like
          </h2>
          <div className="movie-row">
            {genreMovies[genre].map((movie) => (
              <div key={movie.show_id} className="movie-card">
                <img
                  src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <p className="movie-title">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviePage;
