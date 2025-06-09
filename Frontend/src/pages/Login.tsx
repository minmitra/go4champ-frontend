import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthenti } from '../context/AuthentiContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {login} = useAuthenti();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data === 'string' ? data : data.message || 'Login fehlgeschlagen';
        setError(errorMessage);
        return;
      }

      localStorage.setItem('token', data.token);
      login(data.token);
      navigate('/mainpage');
      
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    }
  };

  return (
    <>

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
