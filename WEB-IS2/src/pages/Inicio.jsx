import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import Header from '../components/header';
import CurrentWeatherDisplay from '../components/CurrentWeatherDisplay';
import DailyForecastNav from '../components/DailyForecastNav';
import HourlyForecastDisplay from '../components/HourlyForecastDisplay';
import Tarjetas from '../components/Tarjetas';
import Map from '../components/Map';

function Inicio() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState('');
  const [currentCityName, setCurrentCityName] = useState('Concepción');
  const [mapCoords, setMapCoords] = useState([-36.82707, -73.05021]);
  const [fullWeatherData, setFullWeatherData] = useState(null);
  const [selectedDayDt, setSelectedDayDt] = useState(null);
  const [displayWeather, setDisplayWeather] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener usuario y validar sesión
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('accessToken');
  
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const fetchWeatherData = useCallback(async (city) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/clima/${encodeURIComponent(city)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: No se pudo obtener el clima`);
      }
      const data = await response.json();

      setFullWeatherData(data);

      if (data.daily && data.daily.length > 0) {
        setSelectedDayDt(data.daily[0].dt);
      } else if (data.current) {
        setDisplayWeather(data.current);
        setSelectedDayDt(data.current.dt);
      } else {
        throw new Error("Datos del clima incompletos recibidos del backend.");
      }

      if (data.lat && data.lon) {
        setMapCoords([data.lat, data.lon]);
      }

    } catch (err) {
      console.error("Error en fetchWeatherData:", err);
      setError(err.message);
      setFullWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(currentCityName);
  }, [currentCityName, fetchWeatherData]);

  useEffect(() => {
    if (!fullWeatherData) {
      setDisplayWeather(null);
      return;
    }
    if (selectedDayDt) {
      let weatherToShow = null;
      if (fullWeatherData.current && fullWeatherData.current.dt === selectedDayDt) {
        weatherToShow = { ...fullWeatherData.current };
      } else if (fullWeatherData.daily) {
        const dayData = fullWeatherData.daily.find(d => d.dt === selectedDayDt);
        if (dayData) {
          weatherToShow = { ...dayData };
          if (dayData.dayLabel === "Hoy" && fullWeatherData.current && fullWeatherData.daily && fullWeatherData.daily.length > 0 && fullWeatherData.current.dt === fullWeatherData.daily[0].dt) {
            weatherToShow = {
              ...dayData,
              dt: fullWeatherData.current.dt,
              temperatura: fullWeatherData.current.temperatura,
              sensacion_termica: fullWeatherData.current.sensacion_termica,
              presion: fullWeatherData.current.presion,
              humedad: fullWeatherData.current.humedad,
              visibilidad: fullWeatherData.current.visibilidad,
              punto_rocio: fullWeatherData.current.punto_rocio,
              viento_velocidad: fullWeatherData.current.viento_velocidad,
              descripcion: fullWeatherData.current.descripcion,
              icono: fullWeatherData.current.icono,
              main: fullWeatherData.current.main,
              calidad_aire: fullWeatherData.current.calidad_aire,
              temp_min: dayData.temp_min,
              temp_max: dayData.temp_max,
            };
          }
        }
      }
      if (!weatherToShow && fullWeatherData.current) {
        weatherToShow = { ...fullWeatherData.current };
      }
      setDisplayWeather(weatherToShow);
    } else if (fullWeatherData.current) {
      setDisplayWeather({ ...fullWeatherData.current });
    }
  }, [selectedDayDt, fullWeatherData]);

  useEffect(() => {
    if (!displayWeather || !displayWeather.main || (displayWeather.temperatura === undefined && displayWeather.temp_max === undefined)) {
      setActividades([]);
      return;
    }

    const tempForActivity = displayWeather.temperatura !== undefined ? displayWeather.temperatura : displayWeather.temp_max;
    const estadoDia = displayWeather.main;

    fetch(`http://localhost:8000/actividades/filtrar?estado=${encodeURIComponent(estadoDia)}&temp=${tempForActivity}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al obtener actividades`);
        }
        return res.json();
      })
      .then((data) => setActividades(data))
      .catch((err) => {
        console.error('Error al obtener actividades:', err);
        setActividades([]);
      });
  }, [displayWeather]);

  const handleUbicacionChange = (newCityName, newCoords) => {
    setCurrentCityName(newCityName);
    if (newCoords) {
      setMapCoords(newCoords);
    }
  };

  const handleCityPresetSelect = async (cityName) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error buscando coordenadas de ciudad preseleccionada.");
      const data = await response.json();
      if (data && data.length > 0) {
        const cityData = data[0];
        setCurrentCityName(cityData.display_name);
        if (cityData.lat && cityData.lon) {
          setMapCoords([parseFloat(cityData.lat), parseFloat(cityData.lon)]);
        }
      } else {
        setError("Ciudad preseleccionada no encontrada vía Nominatim.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching preset city coords:", error);
      setError(error.message || "Error al buscar ciudad preseleccionada.");
      setIsLoading(false);
    }
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
    return <div className={styles.fullPageError}>No se pudieron cargar los datos del clima. Comprueba la ciudad e inténtalo de nuevo.</div>;
  }

  return (
    <div className={styles.inicioDashboard}>
      <Header onUbicacionChange={handleUbicacionChange} onCityPresetSelect={handleCityPresetSelect} />
      <main className={styles.mainDashboardContent}>
        <div className={styles.leftColumn}>
          {isLoading && !displayWeather && <p className={styles.loadingMessage}>Actualizando clima...</p>}
          {!isLoading && !displayWeather && fullWeatherData && <p className={styles.loadingMessage}>Selecciona un día para ver el detalle.</p>}
          {displayWeather && <CurrentWeatherDisplay weatherData={displayWeather} cityName={fullWeatherData.ciudad} />}
          {fullWeatherData.daily && fullWeatherData.daily.length > 0 && (
            <DailyForecastNav
              dailyData={fullWeatherData.daily}
              onDaySelect={handleDaySelect}
              selectedDayDt={selectedDayDt}
            />
          )}
          {fullWeatherData && fullWeatherData.hourly && fullWeatherData.hourly.length > 0 && (
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
