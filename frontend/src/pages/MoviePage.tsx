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
      .then((res) => res.json())
      .then((data) => {
        console.log('Recommendations fetched:', data);
        setRecommendedMovies(data);

        // Assuming the backend provides the genre info, you can filter by genre here.
        const genres: { [key: string]: Movie[] } = {};
        data.forEach((movie: Movie) => {
          if (!genres[movie.genre]) genres[movie.genre] = [];
          genres[movie.genre].push(movie);
        });
        setGenreMovies(genres);
      })
      .catch((err) => {
        console.error('Error fetching recommendations:', err);
      });
  }, [userId]);

  return (
    <div className="movie-page">
      {/* ✅ HERO SECTION */}
      <div
        className="hero-banner"
        style={{
          backgroundImage: `url(/images/movies/${encodeURIComponent(
            'Movie Posters'
          )}/${featuredMovie.image})`,
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
          <h2 className="section-title">{genre} Movies You Might Like</h2>
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
