import { useState, useEffect } from "react";
import axios from "axios";

export default function CarouselAllChefs() {
  const [chefs, setChefs] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/chefs/with-preview"
        );
        setChefs(response.data);
      } catch (error) {
        console.error("Errore durante il recupero dei chef:", error);
      }
    };

    fetchChefs();
  }, []);

  const handleNext = () => {
    if (chefs.length > itemsPerView) {
      setStartIndex((prev) => (prev + itemsPerView) % chefs.length);
    }
  };

  const visibleChefs = chefs.slice(startIndex, startIndex + itemsPerView);

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="flex gap-4 transition-all duration-500 relative">
        {chefs.length > itemsPerView && (
          <button
            onClick={handleNext}
            className="absolute cursor-pointer left-[-26px] top-1/2 -translate-y-1/2 bg-white text-yellow-500 text-2xl font-bold py-2 px-4 rounded-full shadow-xl z-10"
          >
            &lt;
          </button>
        )}

        {visibleChefs.map((chef, index) => {
          const profileUrl = chef.profileImage
            ? `http://localhost:3000/${chef.profileImage}`
            : "/images/default-chef.jpg";

          const handleClick = () => {
            if (chef.previewUrl) {
              window.location.href = `/chefs/preview/${chef.id}-${chef.previewUrl}`;
            }
          };

          return (
            <div
              key={index}
              onClick={handleClick}
              className={`relative w-[90vw] max-w-[300px] rounded-xl overflow-hidden shadow-md cursor-pointer ${
                chef.previewUrl ? "" : "pointer-events-none opacity-50"
              }`}
            >
              <img
                src={profileUrl}
                alt={`${chef.first_name || "Chef"} ${chef.last_name || ""}`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                <h3 className="font-semibold text-lg">
                  {chef.first_name || "Chef"} {chef.last_name || ""}
                </h3>
                <p className="text-sm line-clamp-2">
                  {chef.bio || "Chef appassionato, scopri di più..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
