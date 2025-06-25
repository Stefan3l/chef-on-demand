export default function HeroChef({ imageDesktop, imageMobile }) {
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
    </section>
  );
}
