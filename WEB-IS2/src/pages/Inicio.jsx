import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/header';
import CurrentWeatherDisplay from '../components/CurrentWeatherDisplay';
import DailyForecastNav from '../components/DailyForecastNav';
import HourlyForecastDisplay from '../components/HourlyForecastDisplay';
import Tarjetas from '../components/Tarjetas';
import Map from '../components/Map';

function Inicio() {
  const [mapCoords, setMapCoords] = useState([-36.82707, -73.05021]);
  const [fullWeatherData, setFullWeatherData] = useState(null);
  const [selectedDayDt, setSelectedDayDt] = useState(null);
  const [displayWeather, setDisplayWeather] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState('Concepción');
  // Obtener email del usuario
  //useEffect(() => {
  //  const email = localStorage.getItem('userEmail');
  //  if (email) setUserEmail(email);
  // }, []);

  // Obtener datos del clima
  const fetchWeather = async (lat, lon) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/clima/por-coordenadas?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }
      const data = await response.json();
      setFullWeatherData(data);

      if (data.daily?.length) {
        setSelectedDayDt(data.daily[0].dt);
      } else if (data.current) {
        setSelectedDayDt(data.current.dt);
      }
    } catch (err) {
      console.error("Error al obtener clima:", err);
      setError(err.message);
      setFullWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reaccionar a cambios de coordenadas
  useEffect(() => {
    if (!mapCoords || mapCoords.length !== 2) return;
    fetchWeather(mapCoords[0], mapCoords[1]);
  }, [mapCoords]);

  // Determinar clima actual o seleccionado
  useEffect(() => {
    if (!fullWeatherData) {
      setDisplayWeather(null);
      return;
    }

    let weatherToShow = null;
    if (selectedDayDt) {
      if (fullWeatherData.current?.dt === selectedDayDt) {
        weatherToShow = { ...fullWeatherData.current };
      } else {
        weatherToShow = fullWeatherData.daily?.find(d => d.dt === selectedDayDt) || null;
      }
    }

    if (!weatherToShow && fullWeatherData.current) {
      weatherToShow = { ...fullWeatherData.current };
    }

    setDisplayWeather(weatherToShow);
  }, [selectedDayDt, fullWeatherData]);

  // Obtener actividades según clima (con o sin token)
  useEffect(() => {
    if (!displayWeather?.main) {
      setActividades([]);
      return;
    }

    const temp = displayWeather.temperatura ?? displayWeather.temp_max ?? 0;
    const estado = displayWeather.main;
    const description = displayWeather.descripcion
    const hum = displayWeather.humedad
    const viento = displayWeather.viento_velocidad
    const token = localStorage.getItem("accessToken");
    console.log(hum)
    console.log(viento)
    console.log(estado)
    console.log(description)
    const fetchGenericas = () => {
      return fetch(`http://localhost:8000/actividades/filtrar?estado=${encodeURIComponent(estado)}&temp=${temp}&hum=${hum}&viento=${viento}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setActividades(data);
          else setActividades([]);
        })
        .catch(err => {
          console.error("Error actividades generales:", err);
          setActividades([]);
        });
    };

    if (!token) {
      fetchGenericas();
      return;
    }

    fetch(`http://localhost:8000/actividades/recomendadas?estado=${encodeURIComponent(estado)}&temperatura=${temp}&hum=${hum}&viento=${viento}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 404) return fetchGenericas(); // Sin preferencias
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setActividades(data);
      })
      .catch(err => {
        console.error("Error actividades recomendadas:", err);
        fetchGenericas();
      });
  }, [displayWeather]);

  const handleUbicacionChange = (cityData) => {
    if (cityData.lat && cityData.lon) {
      console.log("Ciudad seleccionada:", cityData.display_name); // Depuración
      setMapCoords([parseFloat(cityData.lat), parseFloat(cityData.lon)]);
      setSelectedCityName(cityData.display_name);
    }
  };

  const handleCityPresetSelect = async (cityName) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error buscando coordenadas.");
      const data = await response.json();
      if (data && data.length > 0) {
        const cityData = data[0];
        if (cityData.lat && cityData.lon) {
          setMapCoords([parseFloat(cityData.lat), parseFloat(cityData.lon)]);
        }
      } else {
        setError("Ciudad no encontrada.");
      }
    } catch (error) {
      console.error("Error ciudad preseleccionada:", error);
      setError(error.message || "Error al buscar ciudad.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = ({ lat, lon, name }) => {
    setMapCoords([parseFloat(lat), parseFloat(lon)]);
    setSelectedCityName(name); // Actualiza el nombre de la ciudad
  };

  const handleSelectCity = (cityData) => {
    onUbicacionChange(cityData); // Enviar todo el objeto
    setSearchTerm(cityData.display_name); // Actualiza el campo de búsqueda
    setSearchResults([]); // Limpia los resultados
  };

  const handleDaySelect = (dayDt) => {
    setSelectedDayDt(dayDt);
  };

  if (isLoading && !fullWeatherData && !error) {
    return <div className={styles.fullPageLoading}>Cargando datos iniciales...</div>;
  }

  if (error) {
    return <div className={styles.fullPageError}>Error: {error}. Intenta de nuevo más tarde o con otra ciudad.</div>;
  }

  if (!fullWeatherData) {
    return <div className={styles.fullPageError}>No se pudieron cargar los datos del clima.</div>;
  }

  return (
    <div className={styles.inicioDashboard}>
      <Header onUbicacionChange={handleUbicacionChange} onCityPresetSelect={handleCityPresetSelect} onCitySelect={handleCitySelect} />
      <main className={styles.mainDashboardContent}>
        <div className={styles.leftColumn}>
          {isLoading && !displayWeather && <p className={styles.loadingMessage}>Actualizando clima...</p>}
          {!isLoading && !displayWeather && <p className={styles.loadingMessage}>Selecciona un día para ver el detalle.</p>}
          {displayWeather && (
            <CurrentWeatherDisplay
              weatherData={displayWeather}
              cityName={selectedCityName} // Depuración
            />
          )}
          {fullWeatherData.daily?.length > 0 && (
            <DailyForecastNav
              dailyData={fullWeatherData.daily}
              onDaySelect={handleDaySelect}
              selectedDayDt={selectedDayDt}
            />
          )}
          {fullWeatherData.hourly?.length > 0 && (
            <HourlyForecastDisplay
              allHourlyData={fullWeatherData.hourly}
              selectedDayDt={selectedDayDt}
              timezoneOffset={fullWeatherData.timezone_offset}
            />
          )}
        </div>
        <div className={styles.rightColumn}>
          <Map coords={mapCoords} />
          <Tarjetas recomendaciones={actividades} />
        </div>
      </main>
    </div>
  );
}

export default Inicio;
