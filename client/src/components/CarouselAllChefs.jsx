import { useState, useEffect } from "react";

const chefs = [
  {
    name: "Álvaro Ruiz Domínguez",
    image: "/images/chef1.webp",
    description: "De las mejores cocinas de España a tu mesa...",
    rating: 4.7,
    services: 359,
  },
  {
    name: "Federico Bossini",
    image: "/images/chef7.webp",
    description: "Con profesionalidad, entrega y pasión",
    rating: 4.6,
    services: 300,
  },
  {
    name: "Alberto Mastromatteo",
    image: "/images/chef12.webp",
    description: "Disfrutar y sentir alrededor de una mesa...",
    rating: 4.6,
    services: 299,
  },
  {
    name: "Alberto Mastromatteo",
    image: "/images/chef13.webp",
    description: "Disfrutar y sentir alrededor de una mesa...",
    rating: 4.6,
    services: 299,
  },
  {
    name: "Alberto Mastromatteo",
    image: "/images/chef15.webp",
    description: "Disfrutar y sentir alrededor de una mesa...",
    rating: 4.6,
    services: 299,
  },
];

export default function CarouselAllChefs() {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };

    handleResize(); // init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setStartIndex((prev) => (prev + itemsPerView) % chefs.length);
  };

  const visibleChefs = [];
  for (let i = 0; i < itemsPerView; i++) {
    visibleChefs.push(chefs[(startIndex + i) % chefs.length]);
  }

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="flex gap-4 transition-all duration-500 relative">
        {/* Butonul Next poziționat peste primul card */}
        <button
          onClick={handleNext}
          className="absolute cursor-pointer left-[-26px] top-1/2 -translate-y-1/2 bg-white text-yellow-500 text-2xl font-bold py-2 px-4 rounded-full shadow-xl z-10"
        >
          &lt;
        </button>

        {visibleChefs.map((chef, index) => (
          <div
            key={index}
            className="relative w-[90vw] max-w-[300px] rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={chef.image}
              alt={chef.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
              <h3 className="font-semibold text-lg">{chef.name}</h3>
              <p className="text-sm line-clamp-2">{chef.description}</p>
              <p className="text-sm mt-1">
                ⭐ {chef.rating} • {chef.services} servicios
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
