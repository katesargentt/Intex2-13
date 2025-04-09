import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // 🔐 Password validation rules
  const validatePassword = (pwd: string): string => {
    const issues = [];

    if (pwd.length < 12) issues.push('• At least 12 characters');
    if (!/[A-Z]/.test(pwd)) issues.push('• At least one uppercase letter');
    if (!/[a-z]/.test(pwd)) issues.push('• At least one lowercase letter');
    if (!/[0-9]/.test(pwd)) issues.push('• At least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) issues.push('• At least one special character');

    return issues.join('\n');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic empty field check
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Password strength check
    const passwordErrors = validatePassword(password);
    if (passwordErrors) {
      setError(`Password requirements:\n${passwordErrors}`);
      return;
    }

    // All validations passed
    setError('');

    fetch('https://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          setError('Successful registration. Please log in.');
        } else {
          setError('Error registering. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        setError('Error registering.');
      });
  };

  return (
    <div className="register-wrapper">
      <div className="cine-title" onClick={() => navigate('/')}>
        CineNiche
      </div>
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <div className="d-grid mb-2">
            <button
              className="btn btn-login text-uppercase fw-bold"
              type="submit"
            >
              Create Account
            </button>
          </div>

          <div className="d-grid mb-2">
            <button
              className="btn btn-login text-uppercase fw-bold"
              type="button"
              onClick={handleLoginClick}
            >
              Go to Login
            </button>
          </div>

          {error && (
            <p className="error" style={{ whiteSpace: 'pre-wrap' }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
