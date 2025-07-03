import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ActividadesProyecto() {
  const { id: proyecto_id } = useParams();
  const navigate = useNavigate();

  const [nombreProyecto, setNombreProyecto] = useState('');
  const [actividades, setActividades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    temperatura_min: '',
    temperatura_max: '',
    humedad_max: '',
    viento_max: '',
    estado_dia: '',
    descripcion: '',
  });

  // Buscar nombre del proyecto en localStorage
  useEffect(() => {
    const proyectosGuardados = JSON.parse(localStorage.getItem("misProyectos")) || [];
    const proyecto = proyectosGuardados.find(p => p.id.toString() === proyecto_id);
    setNombreProyecto(proyecto?.name || `ID ${proyecto_id}`);
  }, [proyecto_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaActividad = {
      id: Date.now(),
      proyecto_id,
      nombre: formData.nombre,
      temperatura_min: parseFloat(formData.temperatura_min),
      temperatura_max: parseFloat(formData.temperatura_max),
      humedad_max: parseFloat(formData.humedad_max),
      viento_max: parseFloat(formData.viento_max),
      estado_dia: formData.estado_dia,
      descripcion: formData.descripcion,
    };

    setActividades(prev => [...prev, nuevaActividad]);

    setFormData({
      nombre: '',
      temperatura_min: '',
      temperatura_max: '',
      humedad_max: '',
      viento_max: '',
      estado_dia: '',
      descripcion: '',
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Actividades laborales del proyecto: <span style={{ color: '#60a5fa' }}>{nombreProyecto}</span></h2>

      <button onClick={() => navigate('/proyectos')} style={{ marginBottom: '1rem' }}>
        ⬅ Volver a proyectos
      </button>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Agregar actividad laboral</h3>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la actividad"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="temperatura_min"
          placeholder="Temperatura mínima"
          value={formData.temperatura_min}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="temperatura_max"
          placeholder="Temperatura máxima"
          value={formData.temperatura_max}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="humedad_max"
          placeholder="Humedad máxima (%)"
          value={formData.humedad_max}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="viento_max"
          placeholder="Viento máximo (km/h)"
          value={formData.viento_max}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="estado_dia"
          placeholder="Estado del día (ej. sunny, rain)"
          value={formData.estado_dia}
          onChange={handleChange}
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción de la actividad"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit">Guardar actividad</button>
      </form>

      <h4>Actividades registradas</h4>
      {actividades.length === 0 ? (
        <p>No hay actividades aún.</p>
      ) : (
        <ul>
          {actividades.map((a) => (
            <li key={a.id}>
              <strong>{a.nombre}</strong> ({a.estado_dia})<br />
              Temp: {a.temperatura_min}°C - {a.temperatura_max}°C | Hum: {a.humedad_max}% | Viento: {a.viento_max} km/h
              <p>{a.descripcion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActividadesProyecto;
