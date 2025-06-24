import { useEffect, useState } from "react";
import { CropModal } from "./CropModal";
import axios from "axios";

export default function DishImagesUploader() {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [dishImages, setDishImages] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editDishId, setEditDishId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/chefs/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.dish?.length) {
          setDishImages(res.data.dish);
        }
      } catch (err) {
        console.error("Eroare la fetch preparate:", err);
      }
    };

    fetchImages();
  }, []);

  // Il messaggio per feedback 2 secondi
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

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
      "image",
      new File([blob], `dish-${Date.now()}.jpg`, { type: "image/jpeg" })
    );
    formData.append("category", "Altro");
    formData.append("price", "0");

    const token = localStorage.getItem("token");

    try {
      if (editDishId) {
        const res = await axios.put(
          `http://localhost:3000/api/dishes/${editDishId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setDishImages((prev) =>
          prev.map((img) => (img.id === editDishId ? res.data.image : img))
        );
        showMessage("Foto modificată cu succes!");
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/dishes/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.data?.image) {
          setDishImages((prev) => [...prev, res.data.image]);
          showMessage("Foto piatto caricata con successo!");
        }
      }
    } catch (err) {
      console.error(err);
      showMessage("Errore caricando/modificando la foto del piatto.", "error");
    } finally {
      setImageToCrop(null);
      setEditDishId(null);
    }
  };

  const handleDelete = async (dishId) => {
    const confirmed = confirm("Sei sicuro di voler cancellare questa foto?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/dishes/${dishId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDishImages((prev) => prev.filter((img) => img.id !== dishId));
      showMessage("Foto eliminată!");
    } catch (err) {
      console.error("Eroare la ștergere:", err);
      showMessage("Eroare la ștergerea imaginii", "error");
    }
  };

  const handleEdit = (dishId) => {
    const dish = dishImages.find((d) => d.id === dishId);
    if (!dish) return;
    setImageToCrop(`http://localhost:3000/${dish.url}`);
    setEditDishId(dishId);
    setOpenMenuId(null);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">FOTO DEI TUOI PIATTI</h2>

      {message && (
        <div
          className={`mb-4 px-4 py-2 text-sm rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {dishImages.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={`http://localhost:3000/${img.url}`}
              alt={img.caption || "Piatto"}
              className="w-40 h-40 object-cover rounded-2xl shadow-md"
            />

            <button
              className="absolute top-1 right-1 text-white bg-black/50 rounded-full px-2 py-1 text-sm z-20"
              onClick={() =>
                setOpenMenuId(openMenuId === img.id ? null : img.id)
              }
            >
              ⋮
            </button>

            {openMenuId === img.id && (
              <div className="absolute top-8 right-1 bg-white border rounded shadow z-30 flex flex-col">
                <button
                  className="px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  onClick={() => handleEdit(img.id)}
                >
                  Modifică
                </button>
                <button
                  className="px-4 py-2 text-sm hover:bg-gray-100 text-left text-red-600"
                  onClick={() => handleDelete(img.id)}
                >
                  Șterge
                </button>
              </div>
            )}
          </div>
        ))}

        <label
          htmlFor="dish-upload"
          className="w-40 h-40 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-100 flex items-center justify-center cursor-pointer hover:bg-violet-200"
        >
          <span className="text-4xl text-violet-700 font-bold">+</span>
        </label>
      </div>

      <input
        type="file"
        id="dish-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      <CropModal
        open={!!imageToCrop}
        imageSrc={imageToCrop}
        onClose={() => {
          setImageToCrop(null);
          setEditDishId(null);
        }}
        onSave={handleCropSave}
      />
    </div>
  );
}
