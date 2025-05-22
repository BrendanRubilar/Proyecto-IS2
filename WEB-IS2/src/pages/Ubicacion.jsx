import React, { useState } from 'react';
import '../Ubicacion.css';

function Ubicacion({ onUbicacionChange }) {
  const [ubicacion, setUbicacion] = useState('');
  const [results, setResults] = useState([]);

  const handleUbicacionChangeInput = (e) => {
    setUbicacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ubicacion.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ubicacion)}`;
    const response = await fetch(url);
    const data = await response.json();
    setResults(data);
  };

  const handleSelect = (item) => {
    onUbicacionChange(item);
    setResults([]);
  };

  return (
    <div className="ubicacion-container">
      <h1 className="ubicacion-title">Consulta el Clima</h1>
      <form onSubmit={handleSubmit} className="ubicacion-form">
        <input
          type="text"
          value={ubicacion}
          onChange={handleUbicacionChangeInput}
          placeholder="Ingresa tu ciudad"
          className="ubicacion-input"
        />
        <button type="submit" className="ubicacion-button">
          Buscar
        </button>
      </form>

      <ul>
        {results.map((item, index) => (
          <li key={index} onClick={() => handleSelect(item)}>
            {item.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ubicacion;