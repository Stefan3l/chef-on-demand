import { useState } from "react";
import MenuFormModal from "../../dashboard/MenuFormModal";

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);

  const handleAddMenu = (menuData) => {
    console.log("Meniu nou:", menuData);

    // TODO: axios.post("/api/menus", menuData)

    setMenus((prev) => [...prev, menuData]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">I miei menu</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-4 py-2 rounded"
      >
        ➕ Aggiungi un menu
      </button>

      <MenuFormModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleAddMenu}
      />

      {menus.length === 0 ? (
        <p className="text-gray-500">Nessun menu disponibile.</p>
      ) : (
        <div className="space-y-4">
          {menus.map((menu, index) => (
            <div key={index} className="border rounded p-4 shadow-md">
              <h2 className="text-xl font-semibold">{menu.name}</h2>
              {menu.description && (
                <p className="text-gray-600 mt-1">{menu.description}</p>
              )}
              <p className="mt-2 text-sm">
                Persone: {menu.minGuests} - {menu.maxGuests}
              </p>
              <p className="text-sm">
                Prezzo per persona: €{menu.pricePerPerson}
              </p>

              {/* Categorie + Piatti */}
              <div className="mt-4">
                {menu.categories.map((cat, catIdx) => (
                  <div key={catIdx} className="mb-3">
                    <h3 className="font-semibold">
                      {cat.name} ({cat.type})
                    </h3>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                      {cat.dishes.map((dish, dishIdx) => (
                        <li key={dishIdx}>{dish.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
