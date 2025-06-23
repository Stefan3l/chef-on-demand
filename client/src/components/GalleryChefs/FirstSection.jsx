export default function FirstSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  pb-24">
      <div className="flex flex-col items-center lg:items-start  justify-center  gap-2 lg:mr-10 ">
        <h1 className="text-2xl lg:text-3xl font-semibold">Be your own boss</h1>
        <p className="text-center lg:text-left">
          Take control of your time and future. It's time to break free from the
          confines of restaurant walls and shape your own story.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-2 lg:gap-5 mt-8 lg:mt-0">
          <div className=" flex flex-col items-center justify-center">
            <img
              src="/images/chef2.webp"
              alt="Chef 2"
              className="rounded-xl object-cover w-full h-auto lg:h-[400px] row-span-1"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 lg:gap-5">
            <img
              src="/images/chef1.webp"
              alt="Chef 3"
              className="rounded-xl object-cover w-full h-auto lg:h-[300px] row-span-1"
              loading="lazy"
            />

            <img
              src="/images/chef4.webp"
              alt="Chef 1"
              className="rounded-xl object-cover w-full h-auto lg:h-[240px] row-span-2 col-span-1"
              loading="lazy"
            />
          </div>
          <div className=" flex flex-col items-center justify-center">
            <img
              src="/images/chef3.webp"
              alt="Chef 4"
              className="rounded-xl object-cover w-full h-auto lg:h-[400px] row-span-2"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
