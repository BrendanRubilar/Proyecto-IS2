import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function RecenterMap({ coords }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

function Map({ coords }) {
  return (
    <MapContainer center={coords} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}>
        <Popup>Aquí está tu ciudad</Popup>
      </Marker>
      <RecenterMap coords={coords} />
    </MapContainer>
  );
}

export default Map;