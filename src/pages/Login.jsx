import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "/src/styles/Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
      console.error("Error durante el login:", err);
    }
  };

  return (
    <div className='login'>
      <h2>Iniciar sesión</h2>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">
            Entrar
          </button>

        </form>

        <p className="register-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>

      </div>
    </div>
  );
}

export default Login;