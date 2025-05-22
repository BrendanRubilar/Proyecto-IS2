import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './App.module.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Ubicacion from './pages/Ubicacion.jsx';
import Inicio from './pages/Inicio.jsx';

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.menuHeader}>Menú</div>
          <ul className={styles.menuList}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/ubicacion">Ubicación</Link></li>
          </ul>
        </div>

        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ubicacion" element={<Ubicacion />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;