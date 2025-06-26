import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const CATEGORY_OPTIONS = ["Antipasto", "Primo Piatto", "Secondo", "Dessert"];
const TYPE_OPTIONS = ["All Inclusive", "1", "2", "3", "4"];

export default function MenuFormModal({ isOpen, setIsOpen, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerPerson: "",
    minGuests: "",
    maxGuests: "",
    categories: CATEGORY_OPTIONS.map((cat) => ({
      name: cat,
      type: "All Inclusive",
      dishes: [""],
    })),
  });

  const handleDishChange = (catIndex, dishIndex, value) => {
    const updated = [...formData.categories];
    updated[catIndex].dishes[dishIndex] = value;
    setFormData({ ...formData, categories: updated });
  };

  const addDishInput = (catIndex) => {
    const updated = [...formData.categories];
    updated[catIndex].dishes.push("");
    setFormData({ ...formData, categories: updated });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Crea un nuovo menu
            </Dialog.Title>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nume și Descriere */}
          <input
            type="text"
            placeholder="Nome del menu"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded mb-3"
          />
          <textarea
            placeholder="Descrizione del menu (opzionale)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2 rounded mb-4"
            rows={3}
          />

          {/* Preț și persoane */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <input
              type="number"
              placeholder="Prezzo per persona"
              value={formData.pricePerPerson}
              onChange={(e) =>
                setFormData({ ...formData, pricePerPerson: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min. persone"
              value={formData.minGuests}
              onChange={(e) =>
                setFormData({ ...formData, minGuests: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max. persone"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData({ ...formData, maxGuests: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>

          {/* Categorii */}
          {formData.categories.map((cat, catIndex) => (
            <div key={cat.name} className="mb-6 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{cat.name}</h3>
                <select
                  value={cat.type}
                  onChange={(e) => {
                    const updated = [...formData.categories];
                    updated[catIndex].type = e.target.value;
                    setFormData({ ...formData, categories: updated });
                  }}
                  className="border rounded p-1"
                >
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {cat.dishes.map((dish, dishIndex) => (
                <input
                  key={dishIndex}
                  type="text"
                  placeholder={`Nome del piatto ${dishIndex + 1}`}
                  value={dish}
                  onChange={(e) =>
                    handleDishChange(catIndex, dishIndex, e.target.value)
                  }
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <button
                type="button"
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => addDishInput(catIndex)}
              >
                + Aggiungi piatto
              </button>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Salva Menu
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
