import { useState } from 'react';
import Footer from '../components/Footer';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Placeholder: Replace with actual login logic
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
      <div className="login-page">
        <div className="login-title">CineNiche</div>
        <div className="login-box">
          <h2>Log In</h2>
          <div>
            <label>
              Email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </label>
          </div>
          <button onClick={handleLogin}>Log In</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
