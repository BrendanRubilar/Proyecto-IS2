import React, { useState } from 'react';
import '../Ubicacion.css'; // Asegúrate de crear este archivo CSS

function Ubicacion({ onUbicacionChange }) {
  const [ubicacion, setUbicacion] = useState('');

  const handleUbicacionChange = (e) => {
    setUbicacion(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ubicacion) {
      onUbicacionChange(ubicacion);
    }
  };

  return (
    <div className="ubicacion-container">
      <h1 className="ubicacion-title">Consulta el Clima</h1>
      <form onSubmit={handleSubmit} className="ubicacion-form">
        <input
          type="text"
          value={ubicacion}
          onChange={handleUbicacionChange}
          placeholder="Ingresa tu ciudad"
          className="ubicacion-input"
        />
        <button type="submit" className="ubicacion-button">
          Obtener Clima
        </button>
      </form>
    </div>
  );
}

export default Ubicacion;