import { useState } from "react";
import axios from "axios";
import MapSelector from "../../dashboard/MapSelector";

export default function DoveSei() {
  // Stato per salvare latitudine, longitudine e raggio
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    radiusKm: 50,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Quando l'utente cambia posizione sulla mappa
  const handleLocationChange = ({ latitude, longitude, radiusKm }) => {
    setLocationData({
      latitude,
      longitude,
      radiusKm,
    });
  };

  // Invio dei dati al server
  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    // Verifica se la posizione è valida
    if (
      locationData.latitude === null ||
      locationData.longitude === null ||
      isNaN(locationData.radiusKm)
    ) {
      setErrorMessage("Seleziona una posizione prima di salvare.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:3000/api/chefs/me", locationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Posizione aggiornata con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Errore durante l'aggiornamento della posizione");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Dove sei?</h1>

      {/* Componente che mostra la mappa e seleziona la posizione */}
      <MapSelector onLocationChange={handleLocationChange} />

      {/* Bottone per salvare */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Salvataggio..." : "Salva la posizione"}
      </button>

      {/* Messaggi sotto il bottone */}
      {successMessage && (
        <p className="mt-2 text-green-600 font-medium text-sm">
          ✅ {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-2 text-red-600 font-medium text-sm">
          ❌ {errorMessage}
        </p>
      )}
    </div>
  );
}
