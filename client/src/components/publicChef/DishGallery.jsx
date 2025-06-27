import { useState, useEffect } from "react";

export default function DishGallery({ images = [] }) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  // controlliamo se lo schermo è mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // setiamo il numero di immagini visibili in base la larghezza dello schermo
  useEffect(() => {
    setVisibleCount(isMobile ? 5 : 8);
  }, [isMobile]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + (isMobile ? 3 : 8));
  };
  // Filtro le immagini per rimuovere quelle non valide
  const validImages = images.filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  // se non ci sono immagini valide, ritorniamo null
  if (validImages.length === 0) return null;

  const visibleImages = validImages.slice(0, visibleCount);
  const hasMore = visibleCount < validImages.length;

  return (
    <section className="max-w-[1400px] mx-auto bg-[#FFFFFF] pt-10 pb-10 px-4 lg:px-14 rounded-t-2xl lg:rounded-2xl shadow-lg mt-[-50px] z-10 relative">
      <div className="columns-1 lg:columns-4 gap-5 space-y-5">
        {visibleImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Dish ${idx + 1}`}
            className="w-full h-auto rounded-lg shadow-lg break-inside-avoid"
            loading="lazy"
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer font-semibold py-2 px-6 rounded-full shadow"
          >
            {isMobile ? "Carica di più..." : "Load More..."}
          </button>
        </div>
      )}
    </section>
  );
}
