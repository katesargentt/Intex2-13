import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import PrivacyPage from './pages/PrivacyPage';
import MoviePage from './pages/MoviePage';
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/privacyPolicy" element={<PrivacyPage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/details/:showId" element={<DetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
