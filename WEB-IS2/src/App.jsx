import React, { useState } from 'react';
import styles from './App.module.css'; // Importa los estilos del módulo

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Datos de ejemplo (eventualmente vendrán de una API)
  const climaInfo = {
    temperatura: "24°C",
    viento: "12 km/h",
    humedad: "55%",
    presion: "1015 hPa",
  };

  const recomendaciones = [
    { id: 1, titulo: "Paseo por el parque", descripcion: "Disfruta del aire libre." },
    { id: 2, titulo: "Visita un museo", descripcion: "Ideal si prefieres interiores." },
    { id: 3, titulo: "Tarde de lectura", descripcion: "Un buen libro y una bebida." },
    { id: 4, titulo: "Cine en casa", descripcion: "Perfecto para relajarse." },
    
  ];

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
          <div className={styles.climaCircle}>
            Clima
          </div>
        </div>

        {/* Info clima */}
        <section className={styles.climaInfoSection}>
          <ul>
            <li>Temp: {climaInfo.temperatura}</li>
            <li>Viento: {climaInfo.viento}</li>
          </ul>
          <ul>
            <li>Humedad: {climaInfo.humedad}</li>
            <li>Presión: {climaInfo.presion}</li>
          </ul>
        </section>

        {/* Tarjetas de Recomendaciones */}
        <section className={styles.cardGrid}>
          {recomendaciones.map((rec) => (
            <div key={rec.id} className={styles.card}>
              <h3>{rec.titulo}</h3>
              <p>{rec.descripcion}</p>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}


export default App;