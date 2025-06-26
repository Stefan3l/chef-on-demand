import { useEffect, useState } from "react";
import axios from "axios";
import DishFormModal from "../../dashboard/DishFormModal";

export default function PiattiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/dishes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDishes(response.data);
    } catch (error) {
      console.error(" Eroare la fetch:", error.message);
    }
  };

  const handleAddDish = async (dishData) => {
    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/api/dishes/upload",
        dishData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Piatto creato con successo!");
      setDishes((prev) => [...prev, response.data.image]);
    } catch (error) {
      console.error(" Errore:", error.response?.data || error.message);
      setMessage("Errore durante la creazione del piatto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">I miei piatti</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        ➕ Aggiungi il piatto
      </button>

      <DishFormModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleAddDish}
      />

      {loading && (
        <p className="mt-4 text-sm text-gray-500">Salvataggio in corso...</p>
      )}
      {message && (
        <p className="mt-2 text-sm font-medium text-green-600">{message}</p>
      )}

      <ul className="mt-6 space-y-2">
        {dishes
          .filter((dish) => dish.name && dish.category)
          .map((dish) => (
            <li key={dish.id} className="p-4 rounded-md border shadow-sm">
              <p className="font-semibold text-gray-800">{dish.name}</p>
              <p className="text-sm text-gray-500">
                Categoria: {dish.category}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
