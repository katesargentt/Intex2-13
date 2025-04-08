import React, { useEffect, useState } from 'react';
import './MoviePage.css';

interface Movie {
  show_id: string;
  title: string;
  image: string;
}

const API_URL = "https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net/api";

const endpoint = `${API_URL}/recommend/user/3`;

const featuredMovie = {
  title: 'We Live in Time',
  description:
    'A heartwarming romance that unfolds over decades, revealing the beauty and pain of love.',
  image: 'WE.jpg',
};

const MoviePage: React.FC = () => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setRecommendedMovies(data))
      .catch((err) => console.error('Error fetching recommendations:', err));
  }, []);

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

      {/* ✅ RECOMMENDED SECTION */}
      <h2 className="section-title">Recommended for you</h2>
      <div className="movie-row">
        {recommendedMovies.map((movie) => (
          <div key={movie.show_id} className="movie-card">
            <img
              src={`/images/movies/${encodeURIComponent(
                'Movie Posters'
              )}/${movie.image}`}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = 'none';

                const fallback = document.createElement('div');
                fallback.className = 'fallback-text';
                fallback.innerText = `${movie.title}\nPoster coming soon`;
                target.parentNode?.appendChild(fallback);
              }}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      {/* ✅ ACTION SECTION */}
      <h2 className="section-title">Action</h2>
      <div className="movie-row">
        {[
          { title: 'Extraction', image: 'Extraction.jpg' },
          { title: '6 Underground', image: '6 Underground.jpg' },
          { title: 'Triple Frontier', image: 'Triple Frontier.jpg' },
          { title: 'The Old Guard', image: 'The Old Guard.jpg' },
          { title: 'Bright', image: 'Bright.jpg' },
          { title: 'Spenser Confidential', image: 'Spenser Confidential.jpg' },
          { title: 'Polar', image: 'Polar.jpg' },
          { title: 'Project Power', image: 'Project Power.jpg' },
          { title: 'Red Notice', image: 'Red Notice.jpg' },
          {
            title: 'The Night Comes for Us',
            image: 'The Night Comes for Us.jpg',
          },
          { title: 'Outside the Wire', image: 'Outside the Wire.jpg' },
          { title: 'Close', image: 'Close.jpg' },
          { title: 'Beckett', image: 'Beckett.jpg' },
          { title: 'The Gray Man', image: 'The Gray Man.jpg' },
          { title: 'Wheelman', image: 'Wheelman.jpg' },
        ].map((movie) => (
          <div key={movie.title} className="movie-card">
            <img
              src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'fallback-text';
                fallback.innerText = `${movie.title}\nPoster coming soon`;
                target.parentNode?.appendChild(fallback);
              }}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      {/* ✅ ADVENTURE SECTION */}
      <h2 className="section-title">Adventure</h2>
      <div className="movie-row">
        {[
          { title: 'Mowgli', image: 'Mowgli.jpg' },
          { title: 'Klaus', image: 'Klaus.jpg' },
          { title: 'Rim of the World', image: 'Rim of the World.jpg' },
          { title: 'Jungle Cruise', image: 'Jungle Cruise.jpg' },
          { title: 'Finding ʻOhana', image: 'Finding ʻOhana.jpg' },
          { title: 'Enola Holmes', image: 'Enola Holmes.jpg' },
          { title: 'The Sea Beast', image: 'The Sea Beast.jpg' },
          { title: 'Slumberland', image: 'Slumberland.jpg' },
          { title: 'The Adam Project', image: 'The Adam Project.jpg' },
          { title: 'Chupa', image: 'Chupa.jpg' },
          { title: 'My Fatherʼs Dragon', image: 'My Fatherʼs Dragon.jpg' },
          { title: 'Love and Monsters', image: 'Love and Monsters.jpg' },
          { title: 'The Water Man', image: 'The Water Man.jpg' },
          { title: 'Apollo 10½', image: 'Apollo 10½.jpg' },
          { title: 'We Can Be Heroes', image: 'We Can Be Heroes.jpg' },
        ].map((movie) => (
          <div key={movie.title} className="movie-card">
            <img
              src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'fallback-text';
                fallback.innerText = `${movie.title}\nPoster coming soon`;
                target.parentNode?.appendChild(fallback);
              }}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      {/* ✅ HORROR SECTION */}
      <h2 className="section-title">Horror</h2>
      <div className="movie-row">
        {[
          { title: 'Bird Box', image: 'Bird Box.jpg' },
          { title: 'His House', image: 'His House.jpg' },
          { title: 'The Platform', image: 'The Platform.jpg' },
          { title: '1922', image: '1922.jpg' },
          { title: 'Cam', image: 'Cam.jpg' },
          {
            title: 'No One Gets Out Alive',
            image: 'No One Gets Out Alive.jpg',
          },
          { title: 'The Perfection', image: 'The Perfection.jpg' },
          { title: 'Fear Street Part One', image: 'Fear Street Part One.jpg' },
          { title: 'Fear Street Part Two', image: 'Fear Street Part Two.jpg' },
          {
            title: 'Fear Street Part Three',
            image: 'Fear Street Part Three.jpg',
          },
          { title: 'The Ritual', image: 'The Ritual.jpg' },
          {
            title: 'Things Heard and Seen',
            image: 'Things Heard and Seen.jpg',
          },
          { title: 'Eli', image: 'Eli.jpg' },
          { title: 'The Silence', image: 'The Silence.jpg' },
          { title: 'Malevolent', image: 'Malevolent.jpg' },
        ].map((movie) => (
          <div key={movie.title} className="movie-card">
            <img
              src={`/images/movies/${encodeURIComponent('Movie Posters')}/${movie.image}`}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'fallback-text';
                fallback.innerText = `${movie.title}\nPoster coming soon`;
                target.parentNode?.appendChild(fallback);
              }}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;