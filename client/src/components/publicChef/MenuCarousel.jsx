import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function MenuCarousel({ chefId }) {
  const [menus, setMenus] = useState([]);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!chefId) return;

    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/menus", {
          params: { chefId },
          withCredentials: true,
        });
        setMenus(response.data);
      } catch (error) {
        console.error("Errore durante il caricamento dei menu:", error);
      }
    };

    fetchMenus();
  }, [chefId]);

  if (!chefId)
    return <p className="text-center text-red-600">Cuoco non trovato</p>;
  if (menus.length === 0)
    return <p className="text-center">Non ci sono i menu disponibili</p>;

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? menus.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === menus.length - 1 ? 0 : prev + 1));

  const groupItemsByCategory = (items) => {
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return Object.entries(grouped); // [ [category, items[]], ... ]
  };

  return (
    <div className="w-full py-12">
      <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center overflow-hidden max-w-7xl mx-auto px-4">
        <button
          onClick={prev}
          className="z-10 absolute left-0 bg-white text-yellow-600 p-2 rounded-full shadow-xl"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="relative w-full flex items-center justify-center">
          {menus.map((menu, index) => {
            const position = index - current;
            let style = "absolute transition-all duration-500 ease-in-out";
            let transform = "";

            if (position === 0)
              transform = "translate-x-0 scale-100 opacity-100 z-30";
            else if (
              position === -1 ||
              (current === 0 && index === menus.length - 1)
            )
              transform = "-translate-x-[360px] scale-90 opacity-30 z-20";
            else if (
              position === 1 ||
              (current === menus.length - 1 && index === 0)
            )
              transform = "translate-x-[360px] scale-90 opacity-50 z-20";
            else transform = "opacity-0 scale-75 z-10";

            const groupedItems = groupItemsByCategory(menu.items);

            return (
              <div
                key={menu.id}
                className={`${style} ${transform} bg-white rounded-2xl shadow-xl w-[320px] p-6`}
              >
                <h3 className="text-xl font-semibold text-yellow-600 mb-4">
                  {menu.name}
                </h3>

                {groupedItems.slice(0, 2).map(([category, items], i) => (
                  <div key={i} className="mb-2">
                    <h4 className="font-bold text-sm text-gray-800 uppercase mb-1">
                      {category}
                    </h4>
                    {items[0]?.type && items[0].type !== "All Inclusive" && (
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Puoi scegliere {items[0].type} piatti
                      </p>
                    )}
                    {items[0]?.type === "All Inclusive" && (
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {items[0].type}
                      </p>
                    )}
                    <hr className="text-gray-300" />
                    <div className="space-y-1 text-sm text-gray-700">
                      {items.map((item) => (
                        <p key={item.id}>{item.name}</p>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setOpen(true)}
                  className="text-sm font-medium text-yellow-600 underline mt-4"
                >
                  Menu completo
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="z-10 absolute right-0 bg-white text-yellow-600 p-2 rounded-full shadow-xl"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Modal cu meniul complet */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-gray-300/80" />
        <div className="bg-white max-w-xl w-full p-6 rounded-2xl z-50 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-semibold text-yellow-600 mb-4">
            {menus[current]?.name}
          </h3>

          {groupItemsByCategory(menus[current]?.items || []).map(
            ([category, items], i) => (
              <div key={i} className="mb-6 border-b pb-4 last:border-b-0">
                <h4 className="text-sm font-bold uppercase text-gray-800 mb-1">
                  {category}
                </h4>
                {items[0]?.type && items[0].type !== "All Inclusive" && (
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Puoi scegliere {items[0].type} piatti
                  </p>
                )}
                {items[0]?.type === "All Inclusive" && (
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {items[0].type}
                  </p>
                )}

                <div className="space-y-1 text-sm text-gray-700">
                  {items.map((item) => (
                    <p key={item.id}>{item.name}</p>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Dialog>
    </div>
  );
}
