import { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.min.css";

export default function CropModal({ imageSrc, open, onClose, onSave }) {
  const cropperRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (!canvas) return;

      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
          onClose();
          setLoading(true); // Resetează loading pt următoarea imagine
        }
      }, "image/jpeg");
    }
  };

  const handleImageLoaded = () => {
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[90vw] max-w-3xl relative">
        <h2 className="text-lg font-semibold mb-2">Modifica l'immagine</h2>

        <div className="relative h-[400px] w-full bg-gray-200">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="loader border-4 border-gray-300 border-t-violet-700 rounded-full w-10 h-10 animate-spin" />
            </div>
          )}

          <Cropper
            src={imageSrc}
            style={{ height: 400, width: "100%" }}
            guides={true}
            ref={cropperRef}
            viewMode={0}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            ready={handleImageLoaded}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            className="bg-violet-700 text-white px-6 py-2 rounded hover:bg-violet-600"
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
}
