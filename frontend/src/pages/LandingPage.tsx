import Footer from '../components/Footer';
//import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import CookieConsent from 'react-cookie-consent';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">CineNiche</h1>
          <div className="button-group">
            <button
              className="primary-button"
              onClick={() => navigate('/createAccount')}
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
          disableStyles={true}
          style={{
            background: '#ccd4ff',
            color: '#0f0f2d',
            fontSize: '0.95rem',
            padding: '1rem 2rem',
            borderRadius: '16px',
            width: '80%', // 👈 wider banner
            maxWidth: '600px', // 👈 still responsive
            margin: '0 auto 20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            textAlign: 'left', // 👈 aligns text left
            display: 'flex', // 👈 side-by-side layout
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            position: 'fixed',
            left: '50%',
            bottom: '50px',
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          buttonStyle={{
            background: '#5985DF',
            color: '#fff',
            fontWeight: '500',
            fontSize: '0.95rem',
            borderRadius: '8px',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap', // 👈 prevents wrapping
          }}
          expires={365}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
        <div style={{ height: '150px' }}></div>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
