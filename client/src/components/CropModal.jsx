import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import { getCroppedImg } from "../utils/cropUtils";
import { ModalImage } from "./ModalImage";
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Undo } from "lucide-react";

export function CropModal({ imageSrc, open, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      rotation,
      zoom
    );
    onSave(croppedImage);
    onClose();
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <ModalImage open={open} onClose={onClose}>
      <h2 className="text-center text-lg font-semibold mb-4">
        Modifica la foto profilo
      </h2>

      <div className="relative h-[75vh] bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={9 / 16}
          cropShape="rect"
          showGrid={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* TOOLBAR CU ICONIȚE */}
      <div className="flex justify-center items-center gap-4 mt-4 text-gray-700">
        <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))}>
          <ZoomOut className="w-6 h-6 hover:text-black" />
        </button>
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>
          <ZoomIn className="w-6 h-6 hover:text-black" />
        </button>
        <button onClick={() => setRotation((r) => r - 90)}>
          <RotateCcw className="w-6 h-6 hover:text-black" />
        </button>
        <button onClick={() => setRotation((r) => r + 90)}>
          <RotateCw className="w-6 h-6 hover:text-black" />
        </button>
        <button onClick={handleReset}>
          <Undo className="w-6 h-6 hover:text-black" />
        </button>
      </div>

      {/* BUTOANE DE FINAL */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onClose}
          className="text-sm px-4 py-2 text-gray-600 hover:text-black cursor-pointer"
        >
          Cancella
        </button>
        <button
          onClick={handleSave}
          className="bg-violet-700 cursor-pointer hover:bg-violet-600 text-white px-6 py-2 rounded-md text-sm"
        >
          Save
        </button>
      </div>
    </ModalImage>
  );
}
