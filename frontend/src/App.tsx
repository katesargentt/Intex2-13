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
<<<<<<< HEAD
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
=======
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/privacyPolicy" element={<PrivacyPage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/details/:showId" element={<DetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </>
>>>>>>> 1214d5e9618e997e547c3656f043e0017d6f2955
  );
}

export default App;
