import { useEffect, useState } from "react";
import axios from "axios";

export default function PiattiPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["Antipasto", "Primo", "Secondo", "Dessert"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/api/menu-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const all = response.data; // <--- corect!
      setAllItems(all);
      setFilteredItems(all);
    } catch (error) {
      console.error("Errore nel recupero dei piatti:", error);
      setError("Errore nel recupero dei piatti.");
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    if (selected === "all") {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter((item) => item.category === selected));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">I miei piatti dai menu</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filtra per categoria:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-3 py-1"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Tutte le categorie" : cat}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Caricamento in corso...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="mt-6 space-y-2">
        {filteredItems.length === 0 && !loading ? (
          <p className="text-gray-500">Nessun piatto trovato.</p>
        ) : (
          filteredItems.map((item) => (
            <li
              key={item.id}
              className="p-4 rounded-md border shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Categoria: {item.category}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
