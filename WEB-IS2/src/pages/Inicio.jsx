import React from 'react';
import ImagenNombreClima from '../components/ImagenNombreClima';
import ClimaInfo from '../components/ClimaInfo';
import Tarjetas from '../components/Tarjetas';
function Inicio({ clima, actividades }) {
  return (
    <>
      {clima && <ImagenNombreClima clima={clima} />}
      {clima && <ClimaInfo climaInfo={clima} />}
      <Tarjetas recomendaciones={actividades} />
    </>
  );
}

export default Inicio;
