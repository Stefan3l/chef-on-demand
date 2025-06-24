import { useState } from "react";
import axios from "axios";
import { CropModal } from "../../components/CropModal";

export default function Foto() {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // "profile" | "dish"
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result); // base64 string
      setCropType(type);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (blob) => {
    setCroppedBlob(blob);
    uploadImage(blob, cropType);
  };

  const uploadImage = async (blob, type) => {
    const formData = new FormData();
    const fileName = `${type}-image-${Date.now()}.jpg`;
    formData.append(
      type === "profile" ? "profileImage" : "dishImage",
      new File([blob], fileName, { type: "image/jpeg" })
    );

    const endpoint =
      type === "profile"
        ? "http://localhost:3000/api/chefs/me"
        : "http://localhost:3000/api/dishes/upload";

    try {
      const token = localStorage.getItem("token");
      const method = type === "profile" ? axios.put : axios.post;
      await method(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(
        type === "profile"
          ? "Foto di profilo aggiornata!"
          : "Foto piatto caricata con successo!"
      );
      setImageToCrop(null);
      setCropType(null);
      setCroppedBlob(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Errore caricamento immagine.");
    }
  };

  return (
    <div className="flex flex-col px-6 py-4">
      {/* FOTO PROFILO */}
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
            onChange={(e) => handleFileSelect(e, "profile")}
          />
          <span className="text-violet-700 font-medium hover:underline cursor-pointer">
            Carica una foto
          </span>
        </div>
      </div>

      {/* FOTO PIATTI */}
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
            onChange={(e) => handleFileSelect(e, "dish")}
          />
          <span className="text-violet-700 font-medium hover:underline cursor-pointer">
            Aggiungi altre foto &gt;
          </span>
        </div>
      </div>

      {/* MESSAGGI */}
      {successMsg && (
        <p className="text-green-600 mt-4 text-sm font-medium">{successMsg}</p>
      )}
      {errorMsg && (
        <p className="text-red-600 mt-4 text-sm font-medium">{errorMsg}</p>
      )}

      {/* MODAL CROPPER */}
      <CropModal
        open={!!imageToCrop}
        imageSrc={imageToCrop}
        onClose={() => {
          setImageToCrop(null);
          setCropType(null);
        }}
        onSave={handleCropSave}
      />
    </div>
  );
}
