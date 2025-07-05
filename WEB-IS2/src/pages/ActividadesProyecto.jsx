import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ActividadesProyecto() {
  const { id: proyecto_id } = useParams();
  const navigate = useNavigate();

  const [nombreProyecto, setNombreProyecto] = useState('');
  const [actividades, setActividades] = useState([]);
  
  // Estado del formulario con todos los campos requeridos
  const [formData, setFormData] = useState({
    nombre: '',
    temperatura_min: '',
    temperatura_max: '',
    humedad_max: '',      
    viento_max: '',       
    estado_dia: 'Clear',
    descripcion: '',      
  });

  useEffect(() => {
    try {
      const proyectosGuardados = JSON.parse(localStorage.getItem("misProyectos")) || [];
      const proyectoActual = proyectosGuardados.find(p => p.id.toString() === proyecto_id);
      if (proyectoActual) {
        setNombreProyecto(proyectoActual.name);
      } else {
        setNombreProyecto(`Proyecto ID ${proyecto_id}`);
      }
    } catch (error) {
        console.error("Error al leer proyectos de localStorage", error);
        setNombreProyecto(`Proyecto ID ${proyecto_id}`);
    }
  }, [proyecto_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
        alert("El nombre de la actividad es obligatorio.");
        return;
    }

    // Objeto de nueva actividad con todos los campos
    const nuevaActividad = {
      id: Date.now(),
      proyecto_id: parseInt(proyecto_id, 10),
      nombre: formData.nombre,
      temperatura_min: parseFloat(formData.temperatura_min) || null,
      temperatura_max: parseFloat(formData.temperatura_max) || null,
      humedad_max: parseFloat(formData.humedad_max) || null,     
      viento_max: parseFloat(formData.viento_max) || null,       
      estado_dia: formData.estado_dia,
      descripcion: formData.descripcion,                         
    };

    setActividades(prev => [nuevaActividad, ...prev]);

    // Limpiar el formulario completamente
    setFormData({
      nombre: '',
      temperatura_min: '',
      temperatura_max: '',
      humedad_max: '',
      viento_max: '',
      estado_dia: 'Clear',
      descripcion: '',
    });
  };
  
  const handleEliminarActividad = (actividadId) => {
    setActividades(actividadesActuales =>
      actividadesActuales.filter(a => a.id !== actividadId)
    );
  };

  // Imitar Proyectos.module.css
  const styles = {
    pageContainer: {
        maxWidth: '1200px', width: '90%', margin: '2rem auto', padding: '2.5rem',
        backgroundColor: 'rgba(13, 17, 23, 0.7)', backdropFilter: 'blur(10px)',
        borderRadius: '0.75rem', color: '#e5e7eb'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #374151'
    },
    pageTitle: { fontSize: '2.25rem', fontWeight: 700, color: '#ffffff', margin: 0 },
    pageTitleSpan: { fontWeight: 400, color: '#93c5fd' },
    backButton: {
        background: 'none', border: '1px solid #4b5563', color: '#9ca3af',
        padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 500,
        borderRadius: '0.5rem', cursor: 'pointer', display: 'flex',
        alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease-out'
    },
    formSection: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '2rem',
        borderRadius: '0.75rem', marginBottom: '2.5rem', border: '1px solid #374151'
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    input: {
        padding: '0.8rem 1rem', borderRadius: '0.375rem', border: '1px solid #4b5563',
        backgroundColor: '#1f2937', color: '#e2e8f0', fontSize: '1rem'
    },
    submitButton: {
        backgroundColor: '#10b981', color: 'white', alignSelf: 'flex-start',
        padding: '0.75rem 1.75rem', border: 'none', borderRadius: '0.5rem',
        fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
        transition: 'all 0.2s ease-out'
    },
    listContainer: {
        listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem'
    },
    activityCard: {
        backgroundColor: 'rgba(31, 41, 55, 0.7)', border: '1px solid #374151',
        borderRadius: '0.75rem', padding: '1.5rem', position: 'relative'
    },
    deleteButton: {
        position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(75, 85, 99, 0.3)',
        border: 'none', color: '#9ca3af', fontSize: '1.5rem', fontWeight: 'bold',
        cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease-out'
    }
  };

  return (
    <div style={styles.pageContainer}>
        <div style={styles.header}>
            <h1 style={styles.pageTitle}>
                Actividades del proyecto <span style={styles.pageTitleSpan}>{nombreProyecto}</span>
            </h1>
            <button style={styles.backButton} onClick={() => navigate('/proyectos')}>
                <span style={{ fontSize: '1.25rem' }}>⬅</span>
                Volver a Proyectos
            </button>
        </div>

        <section style={styles.formSection}>
            <h3>Añadir nueva actividad laboral</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input} type="text" name="nombre" placeholder="Nombre de la actividad" value={formData.nombre} onChange={handleChange} required />
                <textarea style={styles.input} name="descripcion" placeholder="Descripción de la actividad" value={formData.descripcion} onChange={handleChange} rows={3} />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input style={{...styles.input, flex: 1}} type="number" step="0.1" name="temperatura_min" placeholder="Temp. Mín (°C)" value={formData.temperatura_min} onChange={handleChange} />
                    <input style={{...styles.input, flex: 1}} type="number" step="0.1" name="temperatura_max" placeholder="Temp. Máx (°C)" value={formData.temperatura_max} onChange={handleChange} />
                </div>
                
                {/* --- NUEVOS CAMPOS AÑADIDOS AL FORMULARIO --- */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input style={{...styles.input, flex: 1}} type="number" step="0.1" name="humedad_max" placeholder="Humedad Máx. (%)" value={formData.humedad_max} onChange={handleChange} />
                    <input style={{...styles.input, flex: 1}} type="number" step="0.1" name="viento_max" placeholder="Viento Máx. (km/h)" value={formData.viento_max} onChange={handleChange} />
                </div>
                
                <select name="estado_dia" value={formData.estado_dia} onChange={handleChange} style={styles.input}>
                    <option value="Clear">Despejado</option>
                    <option value="Clouds">Nublado</option>
                    <option value="Rain">Lluvia</option>
                    <option value="Snow">Nieve</option>
                    <option value="Mist">Niebla</option>
                </select>
                <button type="submit" style={styles.submitButton}>+ Añadir Actividad</button>
            </form>
        </section>

        <section>
            <h3>Actividades del Proyecto</h3>
            {actividades.length === 0 ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#9ca3af' }}>
                    No hay actividades registradas para este proyecto.
                </p>
            ) : (
                <ul style={styles.listContainer}>
                    {actividades.map((act) => (
                        <li key={act.id} style={styles.activityCard}>
                            <button style={styles.deleteButton} onClick={() => handleEliminarActividad(act.id)} aria-label={`Eliminar ${act.nombre}`}>
                                ×
                            </button>
                            <h4 style={{ margin: 0, color: '#93c5fd' }}>{act.nombre}</h4>
                            <p style={{ color: '#cbd5e1', marginBottom: '0.5rem', marginTop: '0.25rem' }}>{act.descripcion}</p>
                            {/* --- VISUALIZACIÓN DE DATOS ACTUALIZADA --- */}
                            <small style={{ color: '#9ca3af' }}>
                                <strong>Condiciones:</strong> {act.estado_dia} | 
                                <strong> Temp:</strong> {act.temperatura_min}°C - {act.temperatura_max}°C |
                                <strong> Humedad:</strong> ≤{act.humedad_max}% |
                                <strong> Viento:</strong> ≤{act.viento_max} km/h
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    </div>
  );
}

export default ActividadesProyecto;