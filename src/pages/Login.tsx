import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login fehlgeschlagen');
        return;
      }

      console.log('Login erfolgreich:', data);
      navigate('/home');
    } catch (err) {
      setError('Fehler bei der Verbindung zum Server');
      console.error(err);
    }
  };

  return (
    <>
      <Navigation />

      <main>
        <form onSubmit={handleSubmit} noValidate>
          <h2>Login</h2>

          {error && <p className="error">{error}</p>}

          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password? Click here
          </Link>

          <input type="submit" value="Login" />

          <Link className="register-button" to="/register">
            Don't have an account? Register here
          </Link>
        </form>
      </main>
    </>
  );
};

export default Login;