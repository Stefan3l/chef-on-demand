import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeroChef from "../components/hero/HeroChef";

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

  return (
    <>
      <HeroChef
        imageDesktop="/images/hero.webp"
        imageMobile="/images/hero-mobile.webp"
        chefData={chefData}
      />
    </>
  );
}
