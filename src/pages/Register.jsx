import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "/src/Register.css";

function Register() {
  const navigate = useNavigate();
  const { register, login } = useContext(AuthContext); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, introduce un email válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      
      const registeredUser = await register({ name, email, phone, password });
      setSuccessMessage('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => {
        navigate('/profile'); 
      }, 1500);

    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Inténtalo de nuevo.');
      console.error("Error durante el registro:", err);
    }
  };

  return (
    <div className='register'>
      <h2>Registrarse</h2>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" placeholder="Ingresa tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Ingresa tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input type="tel" id="phone" placeholder="Ingresa tu teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Crea una contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;