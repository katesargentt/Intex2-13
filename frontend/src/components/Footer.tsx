//footer component, used at the bottom of pages
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="cine-footer">
      <nav className="footer-links">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/privacyPolicy');
          }}
        >
          Privacy Policy
        </a>
        <a href="#">Terms of Service</a>
        <a href="#">Support</a>
        <a href="#">Contact</a>
        {/* admin page link only shows up in user is authenticated as an admin */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
        >
          Admin Page
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
