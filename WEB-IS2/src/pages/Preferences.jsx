import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Preferences.module.css'; 
import ToggleButton from '../components/ToggleButton'; 
import Notification from '../components/Notification'; 

// Definición de categorías de preferencias
const PREFERENCE_CATEGORIES = {
  deportiva: { label: 'Deportiva', types: ['Individual', 'Grupal', 'Virtual'] },
  casa: { label: 'Casa', types: ['Individual', 'Grupal', 'Virtual'] },
  entretenimiento: { label: 'Entretenimiento', types: ['Individual', 'Grupal', 'Virtual'] },
  educativo: { label: 'Educativo', types: ['Individual', 'Grupal', 'Virtual'] },
  recreativa: { label: 'Recreativa', types: ['Individual', 'Grupal', 'Virtual'] },
  cocina: { label: 'Cocina', types: ['Individual', 'Grupal', 'Virtual'] },
};

// Función para generar claves únicas para las preferencias
const generatePreferenceKey = (categoryKey, type) => `${categoryKey}-${type}`;



//entrega valores del GET al mapa (incompleto, ajustar luego)
const int_to_map = (tipo, modalidad) => {
  if(tipo == 1){
    if(modalidad == 1) return ('Deportiva', 'Individual');
    else if(modalidad == 2) return ('Deportiva', 'Grupal');
    else if(modalidad == 3) return ('Deportiva', 'Virtual');
  }
  else if(tipo == 2){
    if(modalidad == 1) return ('Casa', 'Individual');
    else if(modalidad == 2) return ('Casa', 'Grupal');
    else if(modalidad == 3) return ('Casa', 'Virtual');
  }
  else if(tipo == 3){
    if(modalidad == 1) return ('Entretenimiento', 'Individual');
    else if(modalidad == 2) return ('Entretenimiento', 'Grupal');
    else if(modalidad == 3) return ('Entretenimiento', 'Virtual');
  }
  else if(tipo == 4){
    if(modalidad == 1) return ('Educativo', 'Individual');
    else if(modalidad == 2) return ('Educativo', 'Grupal');
    else if(modalidad == 3) return ('Educativo', 'Virtual');
  }
  else if(tipo == 5){
    if(modalidad == 1) return ('Recreativa', 'Individual');
    else if(modalidad == 2) return ('Recreativa', 'Grupal');
    else if(modalidad == 3) return ('Recreativa', 'Virtual');
  }
  else if(tipo == 6){
    if(modalidad == 1) return ('Cocina', 'Individual');
    else if(modalidad == 2) return ('Cocina', 'Grupal');
    else if(modalidad == 3) return ('Cocina', 'Virtual');
  }
};

//entrega valores del mapa al GET (incompleto, ajustar luego)
const map_to_int = (tipo, modalidad) => {
  if(tipo == 'Deportiva'){
    if(modalidad == 'Individual') return (1, 1);
    else if(modalidad == 'Grupal') return (1, 2);
    else if(modalidad == 'Virtual') return (1, 3);
  }
  else if(tipo == 'Casa'){
    if(modalidad == 'Individual') return (2, 1);
    else if(modalidad == 'Grupal') return (2, 2);
    else if(modalidad == 'Virtual') return (2, 3);
  }
  else if(tipo == 'Entretenimiento'){
    if(modalidad == 'Individual') return (3, 1);
    else if(modalidad == 'Grupal') return (3, 2);
    else if(modalidad == 'Virtual') return (3, 3);
  }
  else if(tipo == 'Educativo'){
    if(modalidad == 'Individual') return (4, 1);
    else if(modalidad == 'Grupal') return (4, 2);
    else if(modalidad == 'Virtual') return (4, 3);
  }
  else if(tipo == 'Recreativa'){
    if(modalidad == 'Individual') return (5, 1);
    else if(modalidad == 'Grupal') return (5, 2);
    else if(modalidad == 'Virtual') return (5, 3);
  }
  else if(tipo == 'Cocina'){
    if(modalidad == 'Individual') return (6, 1);
    else if(modalidad == 'Grupal') return (6, 2);
    else if(modalidad == 'Virtual') return (6, 3);
  }
};

const Preferences = () => {
  const [usrPref, setUsrPref] = useState([]);
  const navigate = useNavigate(); 




  /*
  // Agregar el GET aca, reemplazar lectura de localStorage
    const fetchPreferences = async () => {
      try{
        const response = await fetch(`http://localhost:8000/preferencias/`);

        setUsrPref(await response.json());
      } 
      catch (err) {
        console.error("Error al obtener preferencias de usuario.", err);
      }
    }

    useEffect(() => {
      fetchPreferences();
    });

    for(const i of usrPref){
      //iterar y traspasar valores segun la lista
      user_id = data[i].id;
      tipo_actividad = data[i].tipo;
      modalidad_actividad = data[i].modalidad;

      //segun los tres valores, marcar el mapa
      //una vez listo el mapa, estamos listos para dejar el resto del codigo hacer lo suyo
      const aux = int_to_map(tipo_actividad, modalidad_actividad)

    }
  */




  // Estado para las preferencias, cargando desde localStorage o inicializando
  const [preferences, setPreferences] = useState(() => {
    
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) { 
      try {
        const parsed = JSON.parse(savedPreferences);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch (e) {
        console.error("Error al parsear preferencias de localStorage:", e);
      }
    }

    const initialState = {};
    Object.keys(PREFERENCE_CATEGORIES).forEach(categoryKey => {
      PREFERENCE_CATEGORIES[categoryKey].types.forEach(type => {
        initialState[generatePreferenceKey(categoryKey, type)] = false;
      });
    });
    return initialState;
  });

  

  // Estados para la notificación
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showNotification, setShowNotification] = useState(false);

  // Estado para gestionar la acción de guardado y ocultar el botón original
  const [isSaving, setIsSaving] = useState(false); 

  // Efecto para guardar las preferencias en localStorage cada vez que cambian
  useEffect(() => {
    if (typeof preferences === 'object' && preferences !== null) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Manejador para cambiar el estado de una preferencia individual
  const handleTogglePreference = (categoryKey, type) => {
    const prefKey = generatePreferenceKey(categoryKey, type);
    setPreferences(prev => {
      const currentPrefs = (typeof prev === 'object' && prev !== null) ? prev : {};
      return { 
        ...currentPrefs, 
        [prefKey]: !currentPrefs[prefKey] 
      };
    });
  };

  // Manejador para el botón "Guardar y Volver"
  const handleSaveChanges = async () => {
    if (isSaving) return; // Evitar múltiples clics si ya se está procesando

    setIsSaving(true); // Ocultar el botón original y comenzar el proceso de "guardado"
    setNotificationMessage('¡Preferencias Guardadas!'); 
    setNotificationType('success');
    setShowNotification(true); // Indicar al componente Notification que debe empezar a mostrarse

    const notificationEntryAnimationTime = 600;
    const notificationVisibleTimeProp = 1500;  
    const notificationFadeOutTimeProp = 0;     

    // Tiempo total que la notificación estará en pantalla (desde que empieza a aparecer hasta que termina de desaparecer)
    const totalNotificationDisplayCycle = notificationEntryAnimationTime + notificationVisibleTimeProp + notificationFadeOutTimeProp;
    
    // Añadir un pequeño margen para asegurar que la animación de fadeOut termine completamente
    // y que el callback onClose de Notification tenga tiempo de ejecutarse si es necesario.
    const navigationDelay = totalNotificationDisplayCycle; 

    setTimeout(() => {
      navigate('/'); // Redirigir a la página principal
      // El estado (isSaving, showNotification) se reseteará cuando este componente se desmonte
      // y se vuelva a montar la próxima vez que se visite la página.
    }, navigationDelay); 





    //aca se agrega el POST
    //pasar de map a lista de ints
    /*
    try {
      const response = await fetch('http://localhost:8000/preferencias/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usrPref), 
      });
    } catch (err) {
      console.error('Error al enviar las preferencias.', err);
    }
    */




  };

  // Callback para cuando la notificación ha completado su ciclo (llamado desde Notification.jsx)
  const handleNotificationClose = () => {
    setShowNotification(false); // El padre indica que la notificación ya no debe "intentar" mostrarse
    // No es necesario cambiar 'isSaving' aquí si la navegación siempre ocurre y desmonta este componente.
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
              const isActive = preferences && preferences[prefKey] ? !!preferences[prefKey] : false;
              return (
                <ToggleButton
                  key={prefKey}
                  label={type}
                  isActive={isActive}
                  onClick={() => handleTogglePreference(categoryKey, type)}
                />
              );
            })}
          </div>
        </section>
      ))}
      
      <div className={styles.saveButtonWrapper}> 
        {!isSaving && ( // Renderizar el botón solo si no se está en el proceso de guardado/notificación
          <button 
              className={styles.saveButton} 
              onClick={handleSaveChanges}
              disabled={isSaving} // Deshabilitar por si acaso mientras isSaving es true
          >
              Guardar y Volver
          </button>
        )}
        {/* El componente Notification gestiona su propia aparición/desaparición basado en 'isVisible' */}
        <Notification 
          message={notificationMessage} 
          type={notificationType}
          isVisible={showNotification} 
          onClose={handleNotificationClose} 
          duration={1800}       // Tiempo que la notificación está completamente visible y activa (prop para Notification.jsx)
          fadeOutTime={300}     // Duración de la animación CSS de fadeOut (prop para Notification.jsx)
          // entryAnimationTime={600} // Si Notification.jsx necesitara esta prop explícitamente

          buttonText="Guardar y Volver" 
        />
      </div>
    </div>
  );
};

export default Preferences;