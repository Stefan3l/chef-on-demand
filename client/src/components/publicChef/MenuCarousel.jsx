import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const menus = [
  {
    title: "Desayuno Mallorquín",
    content: [
      {
        section: "ENTRANTE",
        items: [
          "Todo incluido",
          "Café de primera calidad",
          "Selección de tés (Té verde, Té inglés, Rooibos,...)",
          "Zumos personalizados",
          "Amanecer Mimosa",
        ],
      },
      {
        section: "PRIMERO",
        items: [
          "Todo incluido",
          "Repostería y charcutería mallorquina",
          "Tazón con yogur griego",
          "Tazón con Kéfir",
          "Selección de tostadas",
        ],
      },
    ],
  },
  {
    title: "Desayuno Mediterráneo",
    content: [
      {
        section: "ENTRANTE",
        items: [
          "Todo incluido",
          "Fruta de temporada",
          "Croissants y bollería fresca",
          "Zumos naturales",
          "Té e infusiones",
        ],
      },
      {
        section: "PRIMERO",
        items: [
          "Tostadas con aguacate",
          "Huevos al gusto",
          "Ensalada de frutas",
        ],
      },
    ],
  },
  {
    title: "Desayuno Clásico",
    content: [
      {
        section: "ENTRANTE",
        items: [
          "Todo incluido",
          "Café o té",
          "Zumo de naranja",
          "Pan con mermelada y mantequilla",
        ],
      },
      {
        section: "PRIMERO",
        items: ["Huevos revueltos", "Tostadas", "Bacon o jamón cocido"],
      },
    ],
  },
];

export default function MenuCarousel() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? menus.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === menus.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full py-12">
      <div className="relative h-[420px]  lg:h-[520px] flex items-center justify-center overflow-hidden max-w-7xl mx-auto px-4">
        <button
          onClick={prev}
          className="z-10 absolute left-0 bg-white p-2 rounded-full shadow-xl"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative w-full flex items-center justify-center ">
          {menus.map((menu, index) => {
            const position = index - current;
            let style = "absolute transition-all duration-500 ease-in-out";
            let transform = "";

            if (position === 0)
              transform =
                "translate-x-0 scale-100 lg:scale-130  opacity-100 z-30";
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

            return (
              <div
                key={index}
                className={`${style} ${transform} bg-white rounded-2xl shadow-xl w-[320px] p-6`}
              >
                <h3 className="text-xl font-semibold text-yellow-600 mb-4">
                  {menu.title}
                </h3>
                {menu.content.slice(0, 2).map((section, i) => (
                  <div key={i} className="mb-2">
                    <h4 className="font-bold text-sm text-gray-800 uppercase mb-1">
                      {section.section}
                    </h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <button
                  onClick={() => setOpen(true)}
                  className="text-sm font-medium text-yellow-600 underline mt-4 cursor-pointer"
                >
                  Ver el menú completo
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="z-10 absolute right-0 bg-white p-2 rounded-full shadow"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="bg-white max-w-xl w-full p-6 rounded-2xl z-50 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-semibold text-yellow-600 mb-4">
            {menus[current].title}
          </h3>
          {menus[current].content.map((section, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="font-bold text-sm text-gray-800 uppercase mb-1">
                {section.section}
              </h4>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
