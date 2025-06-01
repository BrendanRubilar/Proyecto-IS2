import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    const response = await fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), 
    });

    if (response.ok) {
      alert('Registration successful!');
      navigate('/login');
    } else {
      try {
        const errorData = await response.json();
        setError(errorData.detail || 'Registration failed. Please try again.');
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError); 
        setError('Registration failed. An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
        <label>
          Email: 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;