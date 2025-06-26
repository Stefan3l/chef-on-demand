import { useEffect, useState } from "react";
import axios from "axios";
import MenuFormModal from "../../dashboard/MenuFormModal";

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/menus", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMenus(response.data);
    } catch (error) {
      console.error("Errore durante il caricamento", error);
      showMessage("Errore durante il caricamento", "error");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddMenu = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/api/menus",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setMenus((prev) => [response.data, ...prev]);
      showMessage("Il menu è stato creato con successo", "success");
    } catch (error) {
      console.error("Errore durante il caricamento:", error);
      showMessage("Errore durante il caricamento", "error");
    }
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">I miei menu</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        ➕ Crea nuovo menu
      </button>

      <MenuFormModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleAddMenu}
      />

      {/* Afișare mesaj */}
      {message.text && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white ${
            message.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Listează meniurile deja adăugate */}
      <div className="mt-8 space-y-4">
        {menus.map((menu) => (
          <div key={menu.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{menu.name}</h2>
            <p className="text-sm text-gray-500">{menu.description}</p>
            <p className="mt-2 text-sm">
              <strong>Prezzo per persona:</strong> {menu.pricePerPerson} €
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
