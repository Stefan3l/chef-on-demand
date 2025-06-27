import { useEffect, useState } from "react";
import CropModal from "./CropModal";
import axios from "axios";

export default function ProfileImageUploader({ onSuccess, onError }) {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Obține imaginea de profil o singură dată la montare
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/chefs/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.profileImage) {
          setExistingImage(`http://localhost:3000/${res.data.profileImage}`);
        }
      } catch (err) {
        console.error("Eroare la fetch profil:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setImageToCrop(imageURL);
  };

  const handleCropSave = async (blob) => {
    const formData = new FormData();
    formData.append(
      "profileImage",
      new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" })
    );

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3000/api/chefs/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.profileImage) {
        setExistingImage(
          `http://localhost:3000/${res.data.profileImage}?t=${Date.now()}`
        );
        onSuccess("Foto di profilo aggiornata!");
      }
    } catch (err) {
      console.error(err);
      onError("Errore aggiornando la foto di profilo.");
    } finally {
      setImageToCrop(null);
    }
  };

  const handleRemoveImage = () => {
    setExistingImage(null);
    // TODO: eventual trimite și un request la backend pentru a șterge din DB
  };

  return (
    <div className="mb-12 relative">
      <h2 className="text-xl font-semibold mb-4">FOTO DI PROFILO</h2>

      <div className="flex items-center gap-4">
        {existingImage ? (
          <div className="relative">
            <img
              src={existingImage}
              alt="Foto profilo"
              className="w-44 h-44 rounded-xl object-cover border border-gray-300"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-[2px] right-[2px] bg-white text-red-500 border border-gray-300 rounded-full w-5 h-5 text-xs"
              title="Rimuovi"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="profile-upload"
            className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors duration-300"
          >
            <span className="text-xl text-white font-bold leading-none">+</span>
          </label>
        )}

        <input
          type="file"
          id="profile-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        <span
          className="text-violet-700 font-medium hover:underline cursor-pointer"
          onClick={() => document.getElementById("profile-upload").click()}
        >
          {existingImage ? "Modifica foto" : "Carica una foto"}
        </span>
      </div>

      <CropModal
        open={!!imageToCrop}
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop(null)}
        onSave={handleCropSave}
      />
    </div>
  );
}
