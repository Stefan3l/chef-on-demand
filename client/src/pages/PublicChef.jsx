// import components
import HeroChef from "../components/hero/HeroChef";

export default function PublicChef({ fullName, city }) {
  return (
    <>
      <HeroChef
        imageDesktop="/images/hero.webp"
        imageMobile="/images/hero-mobile.webp"
      />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">{`Chef ${fullName}`}</h1>
        <p className="text-lg text-gray-700">{`Chef private in ${city}`} </p>
      </div>
    </>
  );
}
