import { useState } from "react";
import { CropModal } from "./CropModal";
import axios from "axios";

export default function ProfileImageUploader({ onSuccess, onError }) {
  const [imageToCrop, setImageToCrop] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageToCrop(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (blob) => {
    const formData = new FormData();
    formData.append(
      "profileImage",
      new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" })
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:3000/api/chefs/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess("Foto di profilo aggiornata!");
    } catch (err) {
      console.error(err);
      onError("Errore aggiornando la foto di profilo.");
    } finally {
      setImageToCrop(null);
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">FOTO DI PROFILO</h2>
      <div className="flex items-center gap-4">
        <label
          htmlFor="profile-upload"
          className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors duration-300"
        >
          <span className="text-xl text-white font-bold leading-none">+</span>
        </label>
        <input
          type="file"
          id="profile-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        <span className="text-violet-700 font-medium hover:underline cursor-pointer">
          Carica una foto
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
