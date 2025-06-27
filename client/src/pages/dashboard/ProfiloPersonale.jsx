import axios from "axios";
import { useState } from "react";

export default function ProfiloPersonale() {
  const [bio, setBio] = useState("");
  const [story, setStory] = useState("");
  const [startCooking, setStartCooking] = useState("");
  const [secret, setSecret] = useState("");
  const [language, setLanguages] = useState([]);
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

    if (!bio || !story || !startCooking || !secret) {
      setErrorMessage("Tutti i campi descrittivi sono obbligatori.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:3000/api/chefs/me",
        {
          bio,
          story,
          startCooking,
          secret,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Profilo aggiornato con successo!");
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setBio("");
        setStory("");
        setStartCooking("");
        setSecret("");
        setLanguages([]);
      }, 3000);
    } catch (err) {
      console.error("Errore:", err.response?.data || err.message);
      setErrorMessage("Si è verificato un errore.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Il tuo Profilo</h1>
      <form onSubmit={handleSubmit}>
        {/* BIO */}
        <div className="mb-4 ">
          <label className="block mb-2 font-semibold">Parla di te</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Chi sei come chef?"
            className="border-2 border-gray-200 rounded-lg p-2 w-full h-28 pr-16"
            required
          />
        </div>

        {/* STORY */}
        <div className="mb-4 ">
          <label className="block mb-2 font-semibold">
            Raccontaci qualcosa sulla tua cucina
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Da dove nasce la tua passione per la cucina?"
            className="border-2 border-gray-200 rounded-lg p-2 w-full h-28 pr-16"
            maxLength={150}
            required
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {story.length}/150
          </div>
        </div>

        {/* START COOKING */}
        <div className="mb-4 ">
          <label className="block mb-2 font-semibold">
            Quando hai iniziato a cucinare?
          </label>
          <textarea
            value={startCooking}
            onChange={(e) => setStartCooking(e.target.value)}
            placeholder="Scrivi da quanto cucini..."
            className="border-2 border-gray-200 rounded-lg p-2 w-full h-28 pr-16"
            maxLength={150}
            required
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {startCooking.length}/150
          </div>
        </div>

        {/* SECRET */}
        <div className="mb-4 ">
          <label className="block mb-2 font-semibold">
            Svelaci un tuo segreto!
          </label>
          <textarea
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Un piccolo segreto culinario..."
            className="border-2 border-gray-200 rounded-lg p-2 w-full h-28 pr-16"
            maxLength={150}
            required
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {secret.length}/150
          </div>
        </div>

        {/* LINGUE */}
        <div className="mb-6">
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
                  checked={language.includes(lang)}
                  onChange={handleLanguageChange}
                />
                <label htmlFor={lang} className="capitalize">
                  {lang}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-800 px-5 py-2 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-300"
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
