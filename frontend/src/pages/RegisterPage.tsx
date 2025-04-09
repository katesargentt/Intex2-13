import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  // state variables for email and passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // handle submit event for the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate email and passwords
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      // clear error message
      setError('');
      // post data to the /register api
      fetch('https://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        //.then((response) => response.json())
        .then((data) => {
          // handle success or error from the server
          console.log(data);
          if (data.ok) setError('Successful registration. Please log in.');
          else setError('Error registering.');
        })
        .catch((error) => {
          // handle network error
          console.error(error);
          setError('Error registering.');
        });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="cine-title">CineNiche</div>
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
              Register
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

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
