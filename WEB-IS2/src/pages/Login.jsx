import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Inicio de sesión existoso!', data); 
      alert('Inicio de sesión existoso! Token: ' + data.access_token);
      navigate('/');
    } else {
      const errorData = await response.json();
      console.error('Inicio de sesión fallido:', errorData.detail); 
      if (errorData.detail === 'Credenciales invalidas D:') {
        console.warn('Correo o contraseña incorrectos'); 
      } else {
        console.warn('Cuenta no existe u otro error raro, saludos maquina!'); 
      }
      alert('Error, intentalo nuevamente :)');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
