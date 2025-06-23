// import components
import Button from "../buttons/Button";

export default function Hero() {
  return (
    <section className=" w-screen relative left-1/2 right-1/2 -mx-[50vw]">
      <img
        src="../images/hero.webp"
        alte="Hero Image"
        className="hidden lg:block w-full h-[500px] object-cover"
        loading="lazy"
      />
      <img
        src="../images/hero-mobile.webp"
        alte="Hero Image"
        className="lg:hidden w-full h-[500px] object-cover"
        loading="lazy"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Do what you love
          </h1>
          <Button className="py-4" variant="yellow">
            Join Take a Chef
          </Button>
        </div>
      </div>
    </section>
  );
}
