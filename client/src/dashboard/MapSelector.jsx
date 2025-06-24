import { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Circle,
  Autocomplete,
} from "@react-google-maps/api";

// Stile del contenitore della mappa
const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapSelector({ onLocationChange }) {
  // Stato iniziale con coordinate di Bruxelles
  const [position, setPosition] = useState({ lat: 50.8503, lng: 4.3517 });

  // Raggio d'azione iniziale (50 km = 50000 metri)
  const [radius, setRadius] = useState(50000);

  // Riferimenti per la mappa e l'autocompletamento
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Carica le API di Google Maps con la libreria "places"
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Funzione che aggiorna lo stato della posizione e invia i dati al genitore
  const updateLocation = (lat, lng, radius) => {
    setPosition({ lat, lng });
    onLocationChange({
      latitude: lat,
      longitude: lng,
      radiusKm: Math.round(radius / 1000), // Converte da metri a chilometri
    });
  };

  // Quando viene selezionato un luogo tramite l'autocompletamento
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      updateLocation(lat, lng, radius);
      mapRef.current?.panTo({ lat, lng }); // Sposta la mappa al nuovo centro
    }
  };

  // Quando l'utente clicca sulla mappa per scegliere la posizione
  const handleClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      updateLocation(lat, lng, radius);
    },
    [radius]
  );

  // Quando l'utente modifica lo slider del raggio
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    updateLocation(position.lat, position.lng, newRadius);
  };

  // Se la mappa non è ancora pronta, mostra un messaggio
  if (!isLoaded) return <p>Caricamento mappa...</p>;

  return (
    <div>
      <label className="text-lg font-semibold">
        Inserisci la tua posizione
      </label>

      {/* Campo input con autocompletamento degli indirizzi */}
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Inserisci il tuo indirizzo"
          className="border p-4 w-full mb-4 rounded-xl mt-4"
        />
      </Autocomplete>

      {/* Mappa con marker e cerchio del raggio */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={12}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={position} />
        <Circle
          center={position}
          radius={radius}
          options={{
            fillColor: "#6495ED",
            strokeColor: "#1E90FF",
            fillOpacity: 0.25,
          }}
        />
      </GoogleMap>

      {/* Slider per regolare il raggio d'azione */}
      <div className="mt-4">
        <label>Raggio d'azione: {Math.round(radius / 1000)} km</label>
        <input
          type="range"
          min={10000}
          max={100000}
          step={1000}
          value={radius}
          onChange={handleRadiusChange}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
}
