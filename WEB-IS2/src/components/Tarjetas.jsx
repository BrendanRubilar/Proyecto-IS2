import React from 'react'
import styles from '../App.module.css'; 

const Tarjetas = ({ recomendaciones }) => {
    if (!Array.isArray(recomendaciones) || recomendaciones.length === 0) {
        return <p>No se encontraron recomendaciones disponibles.</p>;
    }
    return (
        
        <section className={styles.cardGrid}>
            {recomendaciones.map((rec) => (
                <div key={rec.id} className={styles.card}>
                    <h3>{rec.nombre}</h3>
                        <p>{rec.descripcion}</p>
                </div>
            ))}
        </section>

    );
  };
  
  export default Tarjetas;