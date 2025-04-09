import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import MoviePage from './pages/MoviePage'; // Import MoviePage component
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import DefaultMoviePage from './pages/DefaultMoviePage';
import AuthorizeView from './components/AuthorizeView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPage />} />
        <Route path="/defaultPage/:userId?" element={<DefaultMoviePage />} />

        {/* Protected Routes */}
        <Route
          path="/movies/:userId"
          element={
            <AuthorizeView>
              <MoviePage />
            </AuthorizeView>
          }
        />
        <Route
          path="/movies"
          element={
            <AuthorizeView>
              <MoviePage />
            </AuthorizeView>
          }
        />
        <Route
          path="/details/:showId"
          element={
            <AuthorizeView>
              <DetailPage />
            </AuthorizeView>
          }
        />
        <Route
          path="/details"
          element={
            <AuthorizeView>
              <DetailPage />
            </AuthorizeView>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthorizeView>
              <AdminPage />
            </AuthorizeView>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
