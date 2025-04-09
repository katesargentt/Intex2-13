import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import PrivacyPage from './pages/PrivacyPage';
import MoviePage from './pages/MoviePage'; // Import MoviePage component
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/privacyPolicy" element={<PrivacyPage />} />
        {/* The path below now contains :userId to handle dynamic user ID */}
        <Route path="/movies/:userId" element={<MoviePage />} />
        <Route path="/details" element={<DetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
