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
<<<<<<< HEAD
      console.log('Inicio de sesión existoso!', data); 

      localStorage.setItem('accessToken', data.access_token); 
      localStorage.setItem('userEmail', username); // ← guarda el email del usuario
      alert('Inicio de sesión existoso!'); 
=======
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('userEmail', username);
      localStorage.setItem('is_business', data.is_business);
>>>>>>> ad
      navigate('/');
    } else {
      try {
        const errorData = await response.json();
        console.error('Inicio de sesión fallido:', errorData.detail); 
        alert(errorData.detail || 'Error, inténtalo nuevamente :)'); 
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        alert('Error, inténtalo nuevamente :)');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email: {/* Changed label */}
          <input
            type="email" 
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