import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="cine-footer">
      <nav className="footer-links">
        <a onClick={() => navigate('/privacyPolicy')}>Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Support</a>
        <a href="#">Contact</a>
      </nav>
    </footer>
  );
}

export default Footer;
