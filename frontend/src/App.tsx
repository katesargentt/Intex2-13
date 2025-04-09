import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import PrivacyPage from './pages/PrivacyPage';
import MoviePage from './pages/MoviePage'; // Import MoviePage component
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import DefaultMoviePage from './pages/DefaultMoviePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/privacyPolicy" element={<PrivacyPage />} />
        <Route path="/movies/:userId" element={<MoviePage />} />
        <Route path="/details/:showId" element={<DetailPage />} />
        <Route path="/details" element={<DetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/defaultPage/:userId?" element={<DefaultMoviePage />} />
      </Routes>
    </Router>
  );
}

export default App;
