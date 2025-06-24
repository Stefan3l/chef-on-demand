import { useState } from "react";

// import components
import Hero from "../components/hero/Hero";
import GalleryChefs from "../components/GalleryChefs";
import Banner from "../components/Banner";
import RegisterForm from "../components/RegisterForm";

export default function HomePage() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <>
      <Hero
        title="Do what you love"
        buttonText="Join Take a Chef"
        imageDesktop="/images/hero.webp"
        imageMobile="/images/hero-mobile.webp"
        onRegisterClick={() => setShowRegisterForm(true)}
      />
      <GalleryChefs />
      <div className="lg:mt-36">
        <Banner
          title="Global leaders since 2012"
          buttonText="Join us now"
          imageDesktop="/images/banner.webp"
          imageMobile="/images/banner-mobile.webp"
          onButtonClick={() => (window.location.href = "/signup")}
        />
      </div>
      <RegisterForm
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
      />
    </>
  );
}
