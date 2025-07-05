import React from 'react';
import styles from '../App.module.css';

const TarjetasEmpresa = ({ actividades, clima }) => {
  if (!clima) {
    return <p className={styles.loadingMessage}>Esperando datos del clima...</p>;
  }

  if (!Array.isArray(actividades) || actividades.length === 0) {
    return <p className={styles.loadingMessage}>No hay actividades en el proyecto favorito.</p>;
  }

  const esRecomendada = (actividad) => {
    return (
      clima.temperatura >= actividad.temperatura_min &&
      clima.temperatura <= actividad.temperatura_max &&
      clima.humedad <= actividad.humedad_max &&
      clima.viento_velocidad <= actividad.viento_max &&
      clima.main === actividad.estado_dia
    );
  };

  return (
    <section className={styles.cardGrid}>
      {actividades.map((act) => {
        const recomendada = esRecomendada(act);
        const cardStyle = recomendada ? styles.card : `${styles.card} ${styles.cardNoRecomendada}`;
        
        return (
          <div key={act.id} className={cardStyle}>
            <h3>
              {act.nombre}
              {!recomendada && <span className={styles.noRecomendadaBadge}>No Recomendada</span>}
            </h3>
            <p>{act.descripcion}</p>
          </div>
        );
      })}
    </section>
  );
};

export default TarjetasEmpresa;