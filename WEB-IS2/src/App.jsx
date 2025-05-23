import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css'; // Este será el principal para el layout del dashboard
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
// Ya no necesitamos Ubicacion como página, está en el Header
import Inicio from './pages/Inicio.jsx';

function App() {
  return (
    <Router>
      {/* El div container ahora es global para el fondo oscuro */}
      <div className={styles.appContainer}> 
        {/* Ya no hay menú lateral aquí, el Header está dentro de Inicio */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Podrías añadir una ruta 404 aquí */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;