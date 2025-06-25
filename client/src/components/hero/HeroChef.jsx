export default function HeroChef({ imageDesktop, imageMobile, chefData }) {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mt-[-30px]">
      <img
        src={imageDesktop}
        alt="Hero Desktop"
        className="hidden lg:block w-full h-[500px] object-cover"
        loading="lazy"
      />
      <img
        src={imageMobile}
        alt="Hero Mobile"
        className="lg:hidden w-full h-[500px] object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <div className="flex flex-col items-center justify-center bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">{`Chef ${chefData.first_name} ${chefData.last_name}`}</h1>
          <p className="text-lg text-gray-700">
            {`Chef private in ${chefData.city}`}
          </p>
        </div>
      </div>
    </section>
  );
}
