// import components
import FirstSection from "./GalleryChefs/FirstSection";
import SecondSection from "./GalleryChefs/SecondSection";
import ThirdSection from "./GalleryChefs/ThirdSection";

export default function GalleryChefs() {
  return (
    <>
      <section className="max-w-[1400px] mx-auto bg-white pt-20 lg:pb-120  px-4 lg:px-14 rounded-t-2xl lg:rounded-2xl shadow-lg mt-[-50px] z-10 relative">
        <FirstSection />
        <SecondSection />
      </section>
      <div className="relative z-20 lg:-mt-110  px-4 pb-14 lg:pb-0 lg:px-14 max-w-[1400px] mx-auto bg-white mt-[-10px] lg:bg-transparent ">
        <ThirdSection />
      </div>
    </>
  );
}
