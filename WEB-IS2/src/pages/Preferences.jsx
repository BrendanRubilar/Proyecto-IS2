import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Preferences.module.css'; 
import ToggleButton from '../components/ToggleButton'; 
import Notification from '../components/Notification';

import { ALL_ACTIVITIES_FOR_FAVORITES } from '../data/activitiesMockData';

const PREFERENCE_CATEGORIES = {
  deportiva: { label: 'Deportiva', types: ['Individual', 'Grupal', 'Virtual'] },
  casa: { label: 'Casa', types: ['Individual', 'Grupal', 'Virtual'] },
  entretenimiento: { label: 'Entretenimiento', types: ['Individual', 'Grupal', 'Virtual'] },
  educativo: { label: 'Educativo', types: ['Individual', 'Grupal', 'Virtual'] },
  recreativa: { label: 'Recreativa', types: ['Individual', 'Grupal', 'Virtual'] },
  cocina: { label: 'Cocina', types: ['Individual', 'Grupal', 'Virtual'] },
};
const generatePreferenceKey = (categoryKey, type) => `${categoryKey}-${type}`;
const tipoMap = {
  1: 'deportiva', 2: 'casa', 3: 'entretenimiento', 4: 'educativo', 5: 'recreativa', 6: 'cocina',
};
const modalidadMap = { 1: 'Individual', 2: 'Grupal', 3: 'Virtual' };
const reverseTipoMap = {
  deportiva: 1, casa: 2, entretenimiento: 3, educativo: 4, recreativa: 5, cocina: 6,
};
const reverseModalidadMap = { Individual: 1, Grupal: 2, Virtual: 3 };


const Preferences = () => {
  const [activeSection, setActiveSection] = useState('preferencias');
  
  const [preferences, setPreferences] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [isSaving, setIsSaving] = useState(false);
  
  const [favoritos, setFavoritos] = useState(() => {
    const savedFavoritos = localStorage.getItem('userFavoritos');
    return savedFavoritos ? JSON.parse(savedFavoritos) : [];
  });

  const CLIMA_TRADUCCIONES = {
  Clear: 'despejados',
  Clouds: 'nublados',
  Rain: 'de lluvia',
  Snow: 'con nieve',
  Mist: 'con niebla',
  Drizzle: 'con llovizna',
  Thunderstorm: 'con tormenta',
};

  // 1. Estado para el formulario de la nueva actividad.
  const [newActivity, setNewActivity] = useState({
    nombre: '',
    descripcion: '',
    temperatura_min: 15,
    temperatura_max: 25,
    humedad_max: 80,
    viento_max: 50,
    estado_dia: 'Clear', // Valor por defecto
    consejos: '',
  });

  // 2. Estado para la lista de actividades, cargando desde localStorage.
  const [customActivities, setCustomActivities] = useState(() => {
    const savedCustom = localStorage.getItem('userCustomActivities');
    return savedCustom ? JSON.parse(savedCustom) : [];
  });

  // 3. Guardar en localStorage cada vez que la lista cambie.
  useEffect(() => {
    localStorage.setItem('userCustomActivities', JSON.stringify(customActivities));
  }, [customActivities]);

  // 4. Handler genérico para actualizar el estado del formulario.
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const navigate = useNavigate();

  const getInitialPreferences = () => {
    const initialState = {};
    Object.entries(PREFERENCE_CATEGORIES).forEach(([categoryKey, categoryData]) => {
      categoryData.types.forEach(type => {
        initialState[generatePreferenceKey(categoryKey, type)] = false;
      });
    });
    return initialState;
  };

  useEffect(() => {
    if (activeSection === 'preferencias') {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setPreferences(getInitialPreferences());
        return;
      }
      const fetchPreferences = async () => {
        try {
          const response = await fetch('http://localhost:8000/preferencias/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Error al obtener preferencias');
          const data = await response.json();
          const initialPrefs = getInitialPreferences();
          data.forEach(({ activity_type_id, modality_id }) => {
            const tipo = activity_type_id;
            const modalidad = modality_id;
            const categoryKey = tipoMap[tipo];
            const type = modalidadMap[modalidad];
            if (categoryKey && type) {
              initialPrefs[generatePreferenceKey(categoryKey, type)] = true;
            }
          });
          setPreferences(initialPrefs);
        } catch (error) {
          console.error('Error al cargar preferencias:', error);
          setPreferences(getInitialPreferences());
        }
      };
      fetchPreferences();
    }
  }, [activeSection]);

  const handleTogglePreference = (categoryKey, type) => {
    const key = generatePreferenceKey(categoryKey, type);
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const preferencesToPostBody = () => {
    return Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const [categoryKey, type] = key.split('-');
        return { tipo: reverseTipoMap[categoryKey], modalidad: reverseModalidadMap[type] };
      })
      .filter(p => typeof p.tipo === 'number' && typeof p.modalidad === 'number');
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setNotification({ message: '¡Guardando preferencias...', type: 'info', visible: true });
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({ message: 'No autorizado. Por favor inicia sesión.', type: 'error', visible: true });
      setIsSaving(false); return;
    }
    try {
      const response = await fetch('http://localhost:8000/preferencias/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(preferencesToPostBody()),
      });
      if (!response.ok) throw new Error('Error al guardar preferencias');
      await response.json();
      setNotification({ message: '¡Preferencias guardadas con éxito!', type: 'success', visible: true });
      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
        navigate('/');
      }, 1800);
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error al guardar preferencias.', type: 'error', visible: true });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('userFavoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorite = (activityId) => {
    setFavoritos(prev =>
      prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]
    );
  };

  const isFavorite = (activityId) => favoritos.includes(activityId);

  
  // 5. Lógica para añadir y quitar actividades (LOCALMENTE)
  const handleAddCustomActivity = (e) => {
    e.preventDefault();
    if (!newActivity.nombre.trim()) {
      alert("El nombre de la actividad no puede estar vacío.");
      return;
    }
     if (newActivity.temperatura_min > newActivity.temperatura_max) {
      alert("La temperatura mínima no puede ser mayor que la máxima.");
      return;
    }

    // TODO: Cambiar al backend.
    
    const activityToSave = {
      ...newActivity,
      id: Date.now(), // ID temporal para el frontend
    };

    setCustomActivities(prev => [...prev, activityToSave]);
    
    // Resetear formulario a valores por defecto
    setNewActivity({
      nombre: '', descripcion: '', temperatura_min: 15, temperatura_max: 25,
      humedad_max: 80, viento_max: 50, estado_dia: 'Clear', consejos: '',
    });
    alert("Actividad personalizada añadida localmente.");
  };

  const handleRemoveCustomActivity = (activityId) => {
    // TODO: Cambiar al backend.

    setCustomActivities(prev => prev.filter(activity => activity.id !== activityId));
    alert("Actividad eliminada localmente.");
  };

  return (
    <div className={styles.preferencesPageContainer}>
      <h1 className={styles.mainTitle}>Configuración de Usuario</h1>
      
      <div className={styles.sectionTabs}>
        <button 
          onClick={() => setActiveSection('preferencias')} 
          className={`${styles.tabButton} ${activeSection === 'preferencias' ? styles.activeTab : ''}`}
        >
          Preferencias de Actividad
        </button>
        <button 
          onClick={() => setActiveSection('favoritos')} 
          className={`${styles.tabButton} ${activeSection === 'favoritos' ? styles.activeTab : ''}`}
        >
          Mis Actividades Favoritas
        </button>
        <button 
          onClick={() => setActiveSection('personalizadas')} 
          className={`${styles.tabButton} ${activeSection === 'personalizadas' ? styles.activeTab : ''}`}
        >
          Mis Actividades Personalizadas
        </button>
      </div>

      <div className={styles.sectionContent}>
        {activeSection === 'preferencias' && (
          <div className={styles.preferencesContainer}>
            <p className={styles.subtitle}>
              Selecciona los tipos de actividades que más te interesan.
              Esto nos ayudará a personalizar tus recomendaciones.
            </p>
            {Object.entries(PREFERENCE_CATEGORIES).map(([categoryKey, categoryData]) => (
              <section key={categoryKey} className={styles.categorySection}>
                <h2 className={styles.categoryTitle}>{categoryData.label}</h2>
                <div className={styles.toggleGroup}>
                  {categoryData.types.map(type => {
                    const prefKey = generatePreferenceKey(categoryKey, type);
                    return (
                      <ToggleButton
                        key={prefKey}
                        label={type}
                        isActive={!!preferences[prefKey]}
                        onClick={() => handleTogglePreference(categoryKey, type)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
            <div className={styles.saveButtonWrapper}>
              <button className={styles.saveButton} onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Preferencias y Volver'}
              </button>
              <Notification 
                message={notification.message} type={notification.type}
                isVisible={notification.visible}
                onClose={() => setNotification({ ...notification, visible: false })}
                duration={1800} fadeOutTime={300}
              />
            </div>
          </div>
        )}

        {activeSection === 'favoritos' && (
          <div className={styles.favoritosContainer}>
            <h2 className={styles.sectionTitle}>Mis Actividades Favoritas</h2>
            <p className={styles.sectionSubtitle}>
              Selecciona tus actividades favoritas. Estas podrían tener prioridad en tus recomendaciones.
            </p>
            {ALL_ACTIVITIES_FOR_FAVORITES.length === 0 && <p>No hay actividades disponibles para marcar como favoritas.</p>}
            
            <div className={styles.favoritosGrid}>
              {ALL_ACTIVITIES_FOR_FAVORITES.map(activity => (
                <button
                  key={activity.id}
                  className={`${styles.favoriteActivityCard} ${isFavorite(activity.id) ? styles.activeFavoriteCard : ''}`}
                  onClick={() => toggleFavorite(activity.id)}
                  aria-pressed={isFavorite(activity.id)}
                >
                  <span className={styles.favoriteActivityEmoji}>{activity.emoji}</span>
                  <span className={styles.favoriteActivityName}>{activity.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 6. JSX del nuevo formulario y la lista actualizada */}
        {activeSection === 'personalizadas' && (
          <div className={styles.personalizadasContainer}>
            <h2 className={styles.sectionTitle}>Mis Actividades Personalizadas</h2>
            <p className={styles.sectionSubtitle}>
              Crea tus propias actividades con sus condiciones climáticas ideales para que te las recomendemos en el momento perfecto.
            </p>
            <form onSubmit={handleAddCustomActivity} className={styles.customActivityForm}>
              
              <div className={styles.formGroup}>
                <label htmlFor="nombre">Nombre de la Actividad:</label>
                <input type="text" id="nombre" name="nombre" value={newActivity.nombre} onChange={handleInputChange} placeholder="Ejemplo: Jugar Dark Souls" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" value={newActivity.descripcion} onChange={handleInputChange} placeholder="Ejemplo: Jugar una no-hit" required />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="temperatura_min">Temp. Mínima (°C)</label>
                  <input type="number" id="temperatura_min" name="temperatura_min" value={newActivity.temperatura_min} onChange={handleInputChange} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="temperatura_max">Temp. Máxima (°C)</label>
                  <input type="number" id="temperatura_max" name="temperatura_max" value={newActivity.temperatura_max} onChange={handleInputChange} />
                </div>
                 <div className={styles.formGroup}>
                  <label htmlFor="humedad_max">Humedad Máx. (%)</label>
                  <input type="number" id="humedad_max" name="humedad_max" value={newActivity.humedad_max} onChange={handleInputChange} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="viento_max">Viento Máx. (km/h)</label>
                  <input type="number" step="0.1" id="viento_max" name="viento_max" value={newActivity.viento_max} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="estado_dia">Condición Climática Ideal:</label>
                <select id="estado_dia" name="estado_dia" value={newActivity.estado_dia} onChange={handleInputChange} className={styles.formSelect}>
                  <option value="Clear">Despejado</option>
                  <option value="Clouds">Nublado</option>
                  <option value="Rain">Lluvia</option>
                  <option value="Snow">Nieve</option>
                  <option value="Mist">Niebla</option>
                  <option value="Drizzle">Llovizna</option>
                  <option value="Thunderstorm">Tormenta</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="consejos">Consejos (opcional):</label>
                <textarea id="consejos" name="consejos" value={newActivity.consejos} onChange={handleInputChange} placeholder="Ej: No es tan difícil." />
              </div>
              
              <button type="submit" className={styles.addCustomActivityButton}>
                + Añadir Actividad Personalizada
              </button>
            </form>

            <h3 className={styles.subSectionTitle}>Lista de Actividades Creadas:</h3>
            {customActivities.length === 0 ? (
              <p>Aún no has añadido ninguna actividad personalizada.</p>
            ) : (
              <ul className={styles.customActivityList}>
                {customActivities.map(activity => (
                  <li key={activity.id} className={styles.customActivityItem}>
                    <div>
                      <strong className={styles.customActivityName}>{activity.nombre}</strong>
                      <p className={styles.customActivityDescription}>{activity.descripcion}</p>
                      <p className={styles.customActivityDetails}>
                        Ideal en días <strong>{CLIMA_TRADUCCIONES[activity.estado_dia] || activity.estado_dia}</strong> / Temp: <strong>{activity.temperatura_min}°-{activity.temperatura_max}°C</strong> / Hum: <strong>≤{activity.humedad_max}%</strong> / Viento: <strong>≤{activity.viento_max}km/h</strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveCustomActivity(activity.id)}
                      className={styles.removeCustomActivityButton}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;