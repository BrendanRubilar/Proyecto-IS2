//A manera de resumen este componente no es más que una función, recibe el texto y despliega ciudades validas.
export async function fetchCoordinates(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data?.length > 0
    ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    : null;
}