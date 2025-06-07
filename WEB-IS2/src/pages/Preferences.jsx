import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Preferences.module.css'; 
import ToggleButton from '../components/ToggleButton'; 
import Notification from '../components/Notification'; 

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
  1: 'deportiva',
  2: 'casa',
  3: 'entretenimiento',
  4: 'educativo',
  5: 'recreativa',
  6: 'cocina',
};

const modalidadMap = {
  1: 'Individual',
  2: 'Grupal',
  3: 'Virtual',
};

const reverseTipoMap = {
  deportiva: 1,
  casa: 2,
  entretenimiento: 3,
  educativo: 4,
  recreativa: 5,
  cocina: 6,
};

const reverseModalidadMap = {
  Individual: 1,
  Grupal: 2,
  Virtual: 3,
};

const Preferences = () => {
  const [preferences, setPreferences] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [isSaving, setIsSaving] = useState(false);
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
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setPreferences(getInitialPreferences());
      return;
    }
    const fetchPreferences = async () => {
      try {
        
        console.log(token)
        const response = await fetch('http://localhost:8000/preferencias/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al obtener preferencias');
        const data = await response.json();

        console.log("Preferencias recibidas del servidor:", data);

        const initialPrefs = getInitialPreferences();
        data.forEach(({ activity_type_id, modality_id}) => {
          const tipo = activity_type_id
          const modalidad = modality_id
          console.log("tipo es ",tipo)
          console.log("modalidad es ", modalidad)
          const categoryKey = tipoMap[tipo];
          const type = modalidadMap[modalidad];

          console.log(categoryKey)
          console.log(type)
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
  }, []);

  const handleTogglePreference = (categoryKey, type) => {
    const key = generatePreferenceKey(categoryKey, type);
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const preferencesToPostBody = () => {
    const activePrefs = Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const [categoryKey, type] = key.split('-');
        const tipo = reverseTipoMap[categoryKey];
        const modalidad = reverseModalidadMap[type];

        if (typeof tipo === 'number' && typeof modalidad === 'number') {
          return { tipo, modalidad };
        }
        return null;
      })
      .filter(Boolean);

    console.log("Cuerpo POST a enviar:", activePrefs);

    return activePrefs;
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setNotification({ message: '¡Guardando preferencias...', type: 'info', visible: true });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({ message: 'No autorizado. Por favor inicia sesión.', type: 'error', visible: true });
      setIsSaving(false);
      return;
    }
    const body = preferencesToPostBody();

    try {
      const response = await fetch('http://localhost:8000/preferencias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Error al guardar preferencias');

      const savedPrefs = await response.json();
      console.log("Respuesta POST del servidor:", savedPrefs);

      setNotification({ message: '¡Preferencias guardadas con éxito!', type: 'success', visible: true });

      setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
        navigate('/');
      }, 1800);
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error al guardar preferencias.', type: 'error', visible: true });
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.preferencesContainer}>
      <h1 className={styles.mainTitle}>Preferencias de Actividades</h1>
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
        <button 
          className={styles.saveButton} 
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar y Volver'}
        </button>

        <Notification 
          message={notification.message}
          type={notification.type}
          isVisible={notification.visible}
          onClose={() => setNotification({ ...notification, visible: false })}
          duration={1800}
          fadeOutTime={300}
        />
      </div>
    </div>
  );
};

export default Preferences;
