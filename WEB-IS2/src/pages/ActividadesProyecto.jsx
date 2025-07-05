import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ActividadesProyecto() {
  const { id: proyecto_id } = useParams();
  const navigate = useNavigate();

  const [nombreProyecto, setNombreProyecto] = useState('');
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    temperatura_min: '',
    temperatura_max: '',
    humedad_max: '',
    viento_max: '',
    estado_dia: '',
    descripcion: '',
  });

  //------Ahora se cargar datos del proyecto y sus actividades desde el backend ------ :)
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:8000/projects/${proyecto_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar el proyecto o no tienes permiso.');
      }

      const data = await response.json();
      setNombreProyecto(data.name);
      setActividades(data.labor_activities || []); 
      console.log('Datos del proyecto:', data); // Debug: ver qué datos se reciben

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [proyecto_id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    // Validar que los campos numéricos tienen valores válidos
    const tempMin = parseFloat(formData.temperatura_min);
    const tempMax = parseFloat(formData.temperatura_max);
    const humedadMax = parseInt(formData.humedad_max, 10);
    const vientoMax = parseFloat(formData.viento_max);

    if (isNaN(tempMin) || isNaN(tempMax) || isNaN(humedadMax) || isNaN(vientoMax)) {
      alert('Por favor, ingresa valores numéricos válidos para temperatura, humedad y viento.');
      return;
    }

    if (tempMin >= tempMax) {
      alert('La temperatura mínima debe ser menor que la temperatura máxima.');
      return;
    }

    const actividadParaEnviar = {
      nombre: formData.nombre,
      temperatura_min: tempMin,
      temperatura_max: tempMax,
      humedad_max: humedadMax,
      viento_max: vientoMax,
      estado_dia: formData.estado_dia,
      descripcion: formData.descripcion,
    };

    console.log('Datos a enviar:', actividadParaEnviar); // Debug: ver qué se está enviando

    try {
      const response = await fetch(`http://localhost:8000/projects/${proyecto_id}/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(actividadParaEnviar),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la actividad.');
      }

      setFormData({
        nombre: '',
        temperatura_min: '',
        temperatura_max: '',
        humedad_max: '',
        viento_max: '',
        estado_dia: '',
        descripcion: '',
      });
      fetchProjectData();

    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Cargando actividades del proyecto...</p>;
  if (error) return <p>Error: {error}</p>;

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
          min="-50"
          max="60"
          required
        />

        <input
          type="number"
          step="0.1"
          name="temperatura_max"
          placeholder="Temperatura máxima"
          value={formData.temperatura_max}
          onChange={handleChange}
          min="-50"
          max="60"
          required
        />

        <input
          type="number"
          name="humedad_max"
          placeholder="Humedad máxima (%)"
          value={formData.humedad_max}
          onChange={handleChange}
          min="0"
          max="100"
          required
        />

        <input
          type="number"
          step="0.1"
          name="viento_max"
          placeholder="Viento máximo (km/h)"
          value={formData.viento_max}
          onChange={handleChange}
          min="0"
          max="300"
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
