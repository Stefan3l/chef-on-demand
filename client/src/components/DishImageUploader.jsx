import { useState } from "react";
import { CropModal } from "./CropModal";
import axios from "axios";

export default function DishImagesUploader({ onSuccess, onError }) {
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
      "dishImage",
      new File([blob], `dish-${Date.now()}.jpg`, { type: "image/jpeg" })
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/dishes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess("Foto piatto caricata con successo!");
    } catch (err) {
      console.error(err);
      onError("Errore caricando la foto del piatto.");
    } finally {
      setImageToCrop(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">FOTO DEI TUOI PIATTI</h2>
      <div className="flex items-center gap-6">
        <label
          htmlFor="dish-upload"
          className="w-40 h-40 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-100 flex items-center justify-center cursor-pointer hover:bg-violet-200"
        >
          <span className="text-4xl text-violet-700 font-bold">+</span>
        </label>
        <input
          type="file"
          id="dish-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        <span className="text-violet-700 font-medium hover:underline cursor-pointer">
          Aggiungi altre foto &gt;
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
