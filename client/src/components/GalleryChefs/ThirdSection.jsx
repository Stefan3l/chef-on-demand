export default function ThirdSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] mt-2 lg:mt-10  ">
      <div className="flex flex-col   lg:mt-20  gap-2  lg:mr-10">
        <h1 className="text-2xl lg:text-2xl text-center lg:text-left font-semibold ">
          Build true connections
        </h1>
        <p className="text-center lg:text-left">
          Inspire your guests with the stories behind your dishes and become
          part of a vibrant chef community to elevate your business.
        </p>
      </div>
      <div className=" mt-10 lg:mt-0">
        <div className="grid grid-cols-3 gap-2 lg:gap-5 ">
          <div className=" flex flex-col  gap-2 lg:gap-5 ">
            <img
              src="/images/chef11.webp"
              alt="Chef 11"
              className="rounded-xl object-cover w-full h-auto lg:h-[260px] row-span-1"
              loading="lazy"
            />
            <img
              src="/images/chef12.webp"
              alt="Chef 12"
              className="rounded-xl object-cover w-full h-auto lg:h-[280px] row-span-1"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col  items-center justify-center  ">
            <img
              src="/images/chef13.webp"
              alt="Chef 13"
              className="rounded-xl object-cover w-full h-auto  row-span-1"
              loading="lazy"
            />
          </div>
          <div className=" flex flex-col  gap-2 lg:gap-5  mt-4 lg:mt-8 ">
            <img
              src="/images/chef14.webp"
              alt="Chef 14"
              className="rounded-xl object-cover w-full  lg:h-[240px] row-span-2 hidden lg:block"
              loading="lazy"
            />
            <img
              src="/images/chef15.webp"
              alt="Chef 15"
              className="rounded-xl object-cover w-full  lg:h-[220px] row-span-1 hidden lg:block"
              loading="lazy"
            />
            <img
              src="/images/chef16.webp"
              alt="Chef 16"
              className="rounded-xl object-cover w-full h-auto  row-span-1  lg:hidden"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
