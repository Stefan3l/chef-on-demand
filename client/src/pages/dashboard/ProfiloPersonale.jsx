import axios from "axios";
import { useState } from "react";

export default function ProfiloPersonale() {
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLanguageChange = (e) => {
    const { name, checked } = e.target;
    setLanguages((prev) =>
      checked ? [...prev, name] : prev.filter((lang) => lang !== name)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:3000/api/chefs/me",
        {
          bio,
          languages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Profilo aggiornato con successo!");
      setBio("");
      setLanguages([]);

      // Șterge mesajele după 3 secunde
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    } catch (err) {
      console.error("Errore:", err.response?.data || err.message);
      setErrorMessage("Si è verificato un errore.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">La tua Biografia</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label className="block mb-2">Definisci te stesso in una frase</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Scrivi qui la tua biografia..."
            className="border-2 border-gray-200 rounded-lg p-2 w-full h-32"
            minLength={0}
            maxLength={150}
          ></textarea>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">Lingua di lavoro</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "italian",
              "english",
              "spanish",
              "french",
              "german",
              "portuguese",
            ].map((lang) => (
              <div className="flex items-center gap-2" key={lang}>
                <input
                  type="checkbox"
                  id={lang}
                  name={lang}
                  checked={languages.includes(lang)}
                  onChange={handleLanguageChange}
                />
                <label htmlFor={lang} className="capitalize">
                  {lang}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-800 cursor-pointer px-5 py-2 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
          >
            Salva le Modifiche
          </button>

          {successMessage && (
            <p className="text-green-600 mt-2 text-sm">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}
