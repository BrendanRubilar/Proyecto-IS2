import React from 'react'
import styles from '../App.module.css'; 

const Tarjetas = ({ recomendaciones }) => {
    return (
        <section className={styles.cardGrid}>
            {recomendaciones.map((rec) => (
                <div key={rec.id} className={styles.card}>
                    <h3>{rec.titulo}</h3>
                        <p>{rec.descripcion}</p>
                </div>
            ))}
        </section>

    );
  };
  
  export default Tarjetas;