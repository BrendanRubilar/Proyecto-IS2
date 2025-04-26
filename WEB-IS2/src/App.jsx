import React, { useState, useEffect } from 'react';
import styles from './App.module.css'; // Importa los estilos del módulo
import ClimaInfo from './components/ClimaInfo';
import Tarjetas from './components/Tarjetas';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Datos de ejemplo (eventualmente vendrán de una API)
  const [clima, setClima] = useState(null);
 

  const recomendaciones = [
    { id: 1, titulo: "Paseo por el parque", descripcion: "Disfruta del aire libre." },
    { id: 2, titulo: "Visita un museo", descripcion: "Ideal si prefieres interiores." },
    { id: 3, titulo: "Tarde de lectura", descripcion: "Un buen libro y una bebida." },
    { id: 4, titulo: "Cine en casa", descripcion: "Perfecto para relajarse." },
    
  ];

  useEffect(() => {
    fetch('http://localhost:8000/clima/Concepcion')
      .then((response) => response.json())  // Convierte la respuesta a formato JSON
      .then((data) => {
        console.log(data);  // Muestra los datos en la consola para verificar
        setClima(data);  // Actualiza el estado con los datos recibidos
      })
      .catch((err) => console.error('Error en la solicitud:', err));  // Muestra el error en consola si falla
  }, []);
  
  console.log(clima)
  
  
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

        {/* Círculo Clima */}
      <div className={styles.climaCircleContainer}>
        <div className={styles.climaInfo}>
          {clima && clima.icono ? (
                <img src={`http://openweathermap.org/img/wn/${clima.icono}@2x.png`} alt="icono clima" className={styles.iconoClima} />
                ) : ( <p>Cargando imagen...</p> )}
          <div className={styles.descripcionClima}> {clima ? clima.descripcion : 'Cargando...'} </div>
        </div>
      </div>


        {/* Info clima */}
        <ClimaInfo climaInfo={clima} />
        



        {/* Tarjetas de Recomendaciones */}
        <Tarjetas recomendaciones={recomendaciones} />
        

      </main>
    </div>
  );
}


export default App;