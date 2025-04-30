import React, { useState, useEffect } from 'react';
import styles from './App.module.css'; // Importa los estilos del módulo
import ClimaInfo from './components/ClimaInfo';
import Tarjetas from './components/Tarjetas';
import ImagenNombreClima from './components/ImagenNombreClima';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // clima es la varibla que trae la info al front
  const [clima, setClima] = useState(null);
   const [actividades, setActividades] = useState([]); 

  const recomendaciones = [
    { id: 1, titulo: "Paseo por el parque", descripcion: "Disfruta del aire libre." },
    { id: 2, titulo: "Visita un museo", descripcion: "Ideal si prefieres interiores." },
    { id: 3, titulo: "Tarde de lectura", descripcion: "Un buen libro y una bebida." },
    { id: 4, titulo: "Cine en casa", descripcion: "Perfecto para relajarse." },
    
  ];
  // consulta al backend
  useEffect(() => {
    fetch('http://localhost:8000/clima/Concepcion')
      .then((response) => response.json())  
      .then((data) => {
        console.log(data);  
        setClima(data);  
      })
      .catch((err) => console.error('Error en la solicitud:', err));  
  }, []);
  
  console.log(clima)
  //PARA FILTRAR
  useEffect(() => {
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
    
    // Contenedor principal
    <div className={styles.container}>

      {/* --- Menú Lateral --- */}
      <div className={menuClassName}>
        <div className={styles.menuHeader}>Menú</div>
        <ul className={styles.menuList}>
          <li>Inicio</li>
          <li>Login</li>
          <li>Configuración</li>
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

        {/* Imagen y nombre clima*/}
        <ImagenNombreClima clima = {clima}/>


        {/* Info clima */}
        <ClimaInfo climaInfo={clima} />
        
        {/* Tarjetas de Recomendaciones */}
        <Tarjetas recomendaciones={actividades} />
        

      </main>
    </div>
  );
}


export default App;