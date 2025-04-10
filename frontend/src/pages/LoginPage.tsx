import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ✅ Make sure this is imported

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? 'https://localhost:5000'
      : 'https://cineniche-2-13-backend-f9bef5h7ftbscahz.eastus-01.azurewebsites.net';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const loginUrl = rememberme
      ? `${BASE_URL}/login?useCookies=true`
      : `${BASE_URL}/login?useSessionCookies=true`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      const authRes = await fetch(`${BASE_URL}/pingauth`, {
        credentials: 'include',
      });

      const userInfo = await authRes.json();

      if (userInfo.userId != null) {
        navigate(`/movies/${userInfo.userId}`);
      } else {
        navigate('/movies');
      }
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="cine-title" onClick={() => navigate('/')}>
        CineNiche
      </div>
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberme"
              name="rememberme"
              checked={rememberme}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="rememberme">
              Remember password
            </label>
          </div>

          <div className="d-grid mb-2">
            <button
              className="btn btn-primary btn-login text-uppercase fw-bold"
              type="submit"
            >
              Sign in
            </button>
          </div>

          <div className="d-grid mb-2">
            <button
              className="btn btn-primary btn-login text-uppercase fw-bold"
              type="button"
              onClick={handleRegisterClick}
            >
              Create Account
            </button>
          </div>

          <hr className="my-4" />

          <div className="social-buttons">
            <button className="btn-social btn-google" type="button">
              <i className="fab fa-google me-2"></i> Sign in with Google
            </button>
            <button className="btn-social btn-facebook" type="button">
              <i className="fab fa-facebook-f me-2"></i> Sign in with Facebook
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
