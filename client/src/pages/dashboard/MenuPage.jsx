import { useState, useEffect } from "react";
import axios from "axios";
import MenuFormModal from "../../dashboard/MenuFormModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [expandedMenuId, setExpandedMenuId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/chef/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(response.data);
    } catch (error) {
      console.error("Eroare:", error);
    }
  };

  const handleCreateMenu = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/menus",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
      setMessage(" Menu creato con successo!");
      fetchMenus();
    } catch (error) {
      console.error("Errore creando il menu:", error);
      setMessage(" Errore durante la creazione del menu.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleToggleMenu = (menuId) => {
    setExpandedMenuId((prev) => (prev === menuId ? null : menuId));
  };

  const handleDragEnd = (result, menuId) => {
    if (!result.destination) return;

    const updatedMenus = [...menus];
    const menuIndex = updatedMenus.findIndex((m) => m.id === menuId);
    const items = Array.from(updatedMenus[menuIndex].items);

    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    updatedMenus[menuIndex].items = items;
    setMenus(updatedMenus);
  };

  const handleSaveOrder = async (menuId) => {
    const menu = menus.find((m) => m.id === menuId);
    const orderedItems = menu.items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/menus/${menuId}/reorder`,
        { items: orderedItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Ordine salvata con successo!");
    } catch (err) {
      console.error("Errore salvando ordine:", err);
      setMessage("❌ Errore durante il salvataggio.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
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
        onSubmit={handleCreateMenu}
      />

      {message && (
        <div className="fixed top-6 right-6 px-4 py-2 rounded bg-green-600 text-white shadow-lg">
          {message}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {menus.map((menu) => (
          <div key={menu.id} className="border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{menu.name}</h2>
                <p className="text-sm text-gray-500">{menu.description}</p>
                <p className="text-sm mt-1">
                  <strong>Prezzo per persona:</strong> {menu.pricePerPerson} €
                  <br />
                  <strong>Persone:</strong> da {menu.minGuests} a{" "}
                  {menu.maxGuests}
                </p>
              </div>
              <div className="flex gap-2 items-end">
                <button
                  onClick={() => handleToggleMenu(menu.id)}
                  className="bg-indigo-600 text-white cursor-pointer px-4 py-2 rounded-2xl text-sm shadow hover:bg-indigo-700"
                >
                  {expandedMenuId === menu.id ? "Chiudi" : "Apri"}
                </button>
                <button
                  onClick={() => handleSaveOrder(menu.id)}
                  className="mt-4 bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2  rounded-2xl text-sm shadow"
                >
                  Salva
                </button>
              </div>
            </div>

            {expandedMenuId === menu.id && (
              <div className="mt-4">
                <DragDropContext
                  onDragEnd={(result) => handleDragEnd(result, menu.id)}
                >
                  <Droppable droppableId={`droppable-${menu.id}`}>
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {menu.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={`${item.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 border rounded bg-gray-50"
                              >
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  Categoria: {item.category}
                                </p>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
