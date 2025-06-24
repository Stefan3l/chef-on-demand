import { useState } from "react";
import ProfileImageUploader from "../../components/ProfileImageUploader";
import DishImagesUploader from "../../components/DishImageUploader";

export default function Foto() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="flex flex-col px-6 py-4">
      <ProfileImageUploader onSuccess={setSuccessMsg} onError={setErrorMsg} />
      <DishImagesUploader onSuccess={setSuccessMsg} onError={setErrorMsg} />

      {successMsg && (
        <p className="text-green-600 mt-4 text-sm font-medium">{successMsg}</p>
      )}
      {errorMsg && (
        <p className="text-red-600 mt-4 text-sm font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
