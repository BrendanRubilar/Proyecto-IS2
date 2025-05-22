import React, { useState, useEffect } from 'react';
import styles from '../App.module.css';
import ImagenNombreClima from '../components/ImagenNombreClima';
import ClimaInfo from '../components/ClimaInfo';
import Tarjetas from '../components/Tarjetas';
import Map from '../components/Map';
import Navbar from '../components/Navbar';
import { fetchCoordinates } from '../components/NominatimApi.jsx';

function Inicio() {
  const [clima, setClima] = useState();
  const [actividades, setActividades] = useState([]);
  const [ubicacion, setUbicacion] = useState('Concepcion');

  const [mapCoords, setMapCoords] = useState([-36.82707, -73.05021]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (!ubicacion) return;
    fetch(`http://localhost:8000/clima/${ubicacion}`)
      .then((res) => res.json())
      .then((data) => setClima(data))
      .catch((err) => console.error('Error en la solicitud:', err));
  }, [ubicacion]);

  useEffect(() => {
    if (!clima?.main || clima.temperatura == null) return;
    const { main, temperatura } = clima;
    fetch(`http://localhost:8000/actividades/filtrar?estado=${main}&temp=${temperatura}`)
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.error('Error al obtener actividades:', err));
  }, [clima]);

  const handleUbicacionChange = async (item) => {
    setSelectedCity(item.display_name);
    setUbicacion(item.display_name);
    const coords = await fetchCoordinates(item.display_name);
    if (coords) {
      setMapCoords(coords);
    } else {
      alert('City not found');
    }
  };

  return (
    <div className={styles.inicioContainer}>
      <Navbar onUbicacionChange={handleUbicacionChange} />

      {selectedCity && (
        <div style={{ margin: '1rem 0' }}>
          Seleccionaste: <strong>{selectedCity}</strong>
        </div>
      )}

      {clima && <ImagenNombreClima clima={clima} />}
      {clima && <ClimaInfo climaInfo={clima} />}
      <Tarjetas recomendaciones={actividades} />
      <Map coords={mapCoords} />
    </div>
  );
}

export default Inicio;