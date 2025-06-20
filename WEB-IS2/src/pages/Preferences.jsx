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

  const [customActivities, setCustomActivities] = useState(() => {
    const savedCustom = localStorage.getItem('userCustomActivities');
    return savedCustom ? JSON.parse(savedCustom) : [];
  });
  const [newCustomActivityName, setNewCustomActivityName] = useState('');
  const [newCustomActivityDesc, setNewCustomActivityDesc] = useState('');

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

  useEffect(() => {
    localStorage.setItem('userCustomActivities', JSON.stringify(customActivities));
  }, [customActivities]);

  const handleAddCustomActivity = (e) => {
    e.preventDefault();
    if (!newCustomActivityName.trim()) {
      alert("El nombre de la actividad no puede estar vacío.");
      return;
    }
    const newActivity = {
      id: Date.now(),
      name: newCustomActivityName,
      description: newCustomActivityDesc,
    };
    setCustomActivities(prev => [...prev, newActivity]);
    setNewCustomActivityName('');
    setNewCustomActivityDesc('');
  };

  const handleRemoveCustomActivity = (activityId) => {
    setCustomActivities(prev => prev.filter(activity => activity.id !== activityId));
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

        {activeSection === 'personalizadas' && (
          <div className={styles.personalizadasContainer}>
            <h2 className={styles.sectionTitle}>Mis Actividades Personalizadas</h2>
            <p className={styles.sectionSubtitle}>
              Crea y gestiona tus propias actividades.
            </p>
            <form onSubmit={handleAddCustomActivity} className={styles.customActivityForm}>
              <div className={styles.formGroup}>
                <label htmlFor="customActivityName">Nombre de la Actividad:</label>
                <input 
                  type="text" 
                  id="customActivityName"
                  value={newCustomActivityName} 
                  onChange={(e) => setNewCustomActivityName(e.target.value)} 
                  placeholder="Ej: Jugar Dark souls"
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="customActivityDesc">Descripción (opcional):</label>
                <textarea 
                  id="customActivityDesc"
                  value={newCustomActivityDesc} 
                  onChange={(e) => setNewCustomActivityDesc(e.target.value)}
                  placeholder="Ej: Completa una partida no-hit en Dark Souls"
                />
              </div>
              <button type="submit" className={styles.addCustomActivityButton}>
                + Añadir Actividad Personalizada
              </button>
            </form>

            <h3 className={styles.subSectionTitle}>Lista de Actividades Personalizadas:</h3>
            {customActivities.length === 0 ? (
              <p>Aún no has añadido ninguna actividad personalizada.</p>
            ) : (
              <ul className={styles.customActivityList}>
                {customActivities.map(activity => (
                  <li key={activity.id} className={styles.customActivityItem}>
                    <div>
                      <strong className={styles.customActivityName}>{activity.name}</strong>
                      {activity.description && <p className={styles.customActivityDescription}>{activity.description}</p>}
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