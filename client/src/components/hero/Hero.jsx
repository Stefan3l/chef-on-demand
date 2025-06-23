// import components
import Button from "../buttons/Button";

export default function Hero({
  title,
  buttonText,
  imageDesktop,
  imageMobile,
  onRegisterClick,
}) {
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
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-2xl lg:text-4xl font-semibold">{title}</h1>
          <Button className="py-4" variant="yellow" onClick={onRegisterClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
