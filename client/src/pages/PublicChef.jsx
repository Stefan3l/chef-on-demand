import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import components
import BioChef from "../components/publicChef/BioChef";
import HeroChef from "../components/hero/HeroChef";
import MenuCarousel from "../components/publicChef/MenuCarousel";
import DishGallery from "../components/publicChef/DishGallery";
import ChatModal from "../components/publicChef/ChatModal";

export default function PublicChef() {
  const { previewUrl } = useParams(); // corect
  const [chefData, setChefData] = useState(null);

  const getChefData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/chefs/preview/${previewUrl}`
      );
      setChefData(res.data);
    } catch (error) {
      console.error("Eroare la obținerea datelor chef-ului:", error);
    }
  };

  useEffect(() => {
    getChefData();
  }, [previewUrl]);

  if (!chefData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Preparo gli URL delle immagini dei piatti
  const imageUrls =
    chefData.dish?.map((img) => `http://localhost:3000/${img.url}`) || [];

  return (
    <>
      <HeroChef
        imageDesktop="/images/hero.webp"
        imageMobile="/images/hero-mobile.webp"
        chefData={chefData}
      />
      <BioChef chefData={chefData} />
      <MenuCarousel chefId={chefData.id} />
      <DishGallery images={imageUrls} />
      <ChatModal chefId={chefData.id} />
    </>
  );
}
