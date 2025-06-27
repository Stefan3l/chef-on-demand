import { useState } from "react";

// import components
import Hero from "../components/hero/Hero";
import GalleryChefs from "../components/GalleryChefs";
import Banner from "../components/Banner";
import RegisterForm from "../components/RegisterForm";
import CarouselAllChefs from "../components/CarouselAllChefs";
import Button from "../components/buttons/Button";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 lg:mt-16">
        <div className="flex flex-col justify-center gap-4 px-4">
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Hanno già fatto il passo
          </h1>
          <p className="text-gray-600">
            Unisciti a noi e inizia a ricevere richieste dai tuoi futuri ospiti.
          </p>
          <div className="mt-8">
            <Button
              variant="yellow"
              className="py-4"
              onClick={() => setShowRegisterForm(true)}
            >
              Register Now
            </Button>
          </div>
        </div>
        <CarouselAllChefs />
      </div>
    </>
  );
}
