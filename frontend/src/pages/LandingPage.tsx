import Footer from '../components/Footer';
//import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import CookieConsent from 'react-cookie-consent';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">CineNiche</h1>
        <div className="button-group">
          <button
            className="primary-button"
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
        <div className="carousel">
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/Boom.jpg')" }}
          ></div>
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/Brain on Fire.jpg')" }}
          ></div>
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/About Time.jpg')" }}
          ></div>
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/Bright.jpg')" }}
          ></div>
          <div
            className="movie-card"
            style={{
              backgroundImage:
                "url('/images/Pope Francis A Man of His Word 2.jpg')",
            }}
          ></div>
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/WE.jpg')" }}
          ></div>
          <div
            className="movie-card"
            style={{ backgroundImage: "url('/images/American Woman.jpg')" }}
          ></div>
        </div>
      </div>
      <CookieConsent
        location="bottom"
        buttonText="Got it"
        cookieName="cineNicheCookieConsent"
        style={{
          background: '#101026', // match your page background
          color: '#cfcfe4', // subtle text color
          fontSize: '1rem',
          padding: '1rem 2rem',
        }}
        buttonStyle={{
          background: '#7c9aff', // soft blue (match your buttons)
          color: '#fff',
          fontWeight: '500',
          fontSize: '1rem',
          borderRadius: '8px',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
        }}
        expires={365}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      <Footer />
    </div>
  );
}

export default LandingPage;
