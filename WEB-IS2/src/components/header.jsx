import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const UbicacionSearch = ({ onUbicacionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching location:", error);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

const handleSelectCity = (cityData) => {
  onUbicacionChange(cityData); // enviar todo el objeto
  setSearchTerm(cityData.display_name);
  setSearchResults([]);
};

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar ubicación"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton} disabled={isLoading}>
          {isLoading ? '...' : '🔍'}
        </button>
      </form>
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map(item => (
            <li key={item.place_id} onClick={() => handleSelectCity(item)}>
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Header = ({ onUbicacionChange, onCityPresetSelect }) => {
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');

    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    } else {
      setIsAuthenticated(false);
      setUserEmail('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    
    window.location.href = '/'; // Recarga la página 
    alert('Sesión cerrada correctamente');
  };

  const cityPresets = ["Santiago, Chile", "Viña del Mar, Chile", "Antofagasta, Chile", "Temuco, Chile", "Puerto Montt, Chile"];

  return (
    <header className={styles.appHeader}>
      <div className={styles.leftSection}>
        <UbicacionSearch onUbicacionChange={onUbicacionChange} />
        <div className={styles.cityPresets}>
          {cityPresets.map(city => (
            <button key={city} onClick={() => onCityPresetSelect(city)} className={styles.cityPresetButton}>
              {city}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.rightSection}>
        {isAuthenticated ? (
          <>
            <span className={styles.userInfo}> Bienvenido, {userEmail.split('@')[0]}</span>
            <Link to="/preferences" className={styles.authLink}>Preferencias</Link>
            <button className={styles.logoutLink} onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.authLink}>Login</Link>
            <Link to="/register" className={styles.authLink}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
