// import components
import MenuCarousel from "./MenuCarousel";

export default function MenuChef() {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[#ffffff] mt-14">
      <div className="max-w-[1400px] mx-auto py-14">
        <h1 className="text-center text-2xl lg:text-4xl font-semibold lg:mb-8">
          I miei Menu
        </h1>
        <div>
          <MenuCarousel />
        </div>
      </div>
    </section>
  );
}
