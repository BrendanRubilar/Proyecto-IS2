import React, { useState, useEffect } from 'react';
import styles from './App.module.css'; // Importa los estilos del módulo
import { Link } from 'react-router-dom';

import ClimaInfo from './components/ClimaInfo';
import Tarjetas from './components/Tarjetas';
import ImagenNombreClima from './components/ImagenNombreClima';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ubicacion from './pages/Ubicacion';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // clima es la varibla que trae la info al front
  const [clima, setClima] = useState();
  const [actividades, setActividades] = useState([]); 
  const [ubicacion, setUbicacion] = useState('Concepcion');

  const recomendaciones = [
    { id: 1, titulo: "Paseo por el parque", descripcion: "Disfruta del aire libre." },
    { id: 2, titulo: "Visita un museo", descripcion: "Ideal si prefieres interiores." },
    { id: 3, titulo: "Tarde de lectura", descripcion: "Un buen libro y una bebida." },
    { id: 4, titulo: "Cine en casa", descripcion: "Perfecto para relajarse." },
    
  ];
  // consulta al backend
  useEffect(() => {
    if (!ubicacion) return;
    if (ubicacion) {
      fetch(`http://localhost:8000/clima/${ubicacion}`)
        .then((response) => response.json())
        .then((data) => {
          setClima(data);  // Actualiza el estado con la respuesta de la API
        })
        .catch((err) => console.error('Error en la solicitud:', err));
    }
  }, [ubicacion]);
  
  console.log(clima)
  //PARA FILTRAR
  useEffect(() => {
  if (!clima || !clima.main || clima.temperatura == null) return;
  if (clima) {
    const estado = clima.main;
    const temp = clima.temperatura;

    fetch(`http://localhost:8000/actividades/filtrar?estado=${estado}&temp=${temp}`)
      .then((res) => res.json())
      .then((data) => {
        setActividades(data); // Guardamos las actividades filtradas
      })
      .catch((err) => console.error('Error al obtener actividades:', err));


  }
    }, [clima]);
 console.log(actividades)
  
  // --- CLASES DINÁMICAS ---
  // Clase para el menú lateral (abierto/cerrado)
  const menuClassName = `${styles.menu} ${menuOpen ? styles.menuOpen : styles.menuClosed}`;
  // Clase para el CONTENEDOR del botón hamburguesa (posición normal/desplazada)
  const hamburgerContainerClassName = `${styles.hamburgerButtonContainer} ${menuOpen ? styles.hamburgerButtonContainerOpen : ''}`;

  return (

    <Router>
    
    
    <div className={styles.container}>

    
      {/* --- Menú Lateral --- */}
      <div className={menuClassName}>
        <div className={styles.menuHeader}>Menú</div>
        <ul className={styles.menuList}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li> {/* Added link to Register */}
          <li><Link to="/configuracion">Configuración</Link></li>
          <li><Link to="/ubicacion">Ubicación</Link></li> {/* Nuevo */}
          
        </ul>
         <button
            onClick={toggleMenu}
            className={styles.menuCloseButton}
          >
            Cerrar Menú
          </button>
      </div>

      {/* Overlay (opcional, para cerrar menú al hacer clic fuera) */}
      {menuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}

      {/* --- Botón Hamburguesa --- */}
      {/* Aplicamos la clase dinámica al CONTENEDOR */}
      <div className={hamburgerContainerClassName}>
        <button onClick={toggleMenu} className={styles.hamburgerButton} aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* --- Contenido Principal --- */}
      <main className={styles.mainContent}>
      <Routes>
            <Route path="/" element={<Inicio clima={clima} actividades={actividades} />} />
            <Route path="/ubicacion" element={<Ubicacion onUbicacionChange={setUbicacion} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        
      
      </main>
    </div>
    
    </Router>
  );
}


export default App;