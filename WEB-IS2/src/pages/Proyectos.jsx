import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

function Proyectos() {
  const [isBusiness, setIsBusiness] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const business = JSON.parse(localStorage.getItem("is_business"));
    const email = localStorage.getItem("userEmail");

    if (!business) {
      alert("Solo usuarios de empresa pueden acceder a esta sección.");
      navigate("/");
    } else {
      setIsBusiness(true);
      setUserEmail(email);
      // Simulación de proyectos existentes 
      setProyectos([
        { id: 1, titulo: "Proyecto A", descripcion: "Primera iniciativa" },
        { id: 2, titulo: "Proyecto B", descripcion: "Desarrollo en curso" }
      ]);//BORRAR DESPUES
    }
  }, [navigate]);

  const handleCrearProyecto = (e) => {
    e.preventDefault();

    if (!nuevoTitulo.trim()) {
      alert("El título es obligatorio.");
      return;
    }

    const nuevoProyecto = {
      id: proyectos.length + 1,
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion
    };

    setProyectos([...proyectos, nuevoProyecto]);
    setNuevoTitulo('');
    setNuevaDescripcion('');
  };

  return (
    <div className={styles.inicioDashboard}>
      <h1>Proyectos de {userEmail.split('@')[0]}</h1>

      <button onClick={() => navigate("/")} className={styles.authLink}>
        ⬅ Volver al inicio
        
      </button>

      <form onSubmit={handleCrearProyecto} style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <h3>Crear nuevo proyecto</h3>
        <input
          type="text"
          placeholder="Título del proyecto"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          required
          style={{
            display: 'block',
            width: '10%',
            marginBottom: '1rem',
            padding: '0.5rem',
            fontSize: '1rem'
          }}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={nuevaDescripcion}
          onChange={(e) => setNuevaDescripcion(e.target.value)}
          rows={3}
          style={{
            display: 'block',
            width: '50%',
            marginBottom: '1rem',
            padding: '0.5rem',
            fontSize: '1rem'
          }}
        />
        <button type="submit" className={styles.authLink}>Guardar proyecto</button>
      </form>

      <h3>Proyectos existentes</h3>
      {proyectos.length === 0 ? (
        <p>No hay proyectos registrados aún.</p>
      ) : (
        <ul>
          {proyectos.map(p => (
            <li key={p.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{p.titulo}</strong><br />
              <small>{p.descripcion}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Proyectos;
