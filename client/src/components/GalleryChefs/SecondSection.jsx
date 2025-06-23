export default function SecondSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] mt-2 lg:mt-10  pb-24">
      <div className="flex flex-col items-center  justify-center  gap-3 order-1 lg:order-2 lg:ml-10">
        <h1 className="text-2xl lg:text-3xl font-semibold ">
          Cook your own creations
        </h1>
        <p className="text-center lg:text-left">
          Elevate your signature dishes to the spotlight and set all your great
          ideas free.
        </p>
      </div>
      <div className="order-2 lg:order-1 mt-8 lg:mt-0">
        <div className="grid grid-cols-3 gap-2 lg:gap-5 ">
          <div className=" flex flex-col  gap-2 lg:gap-5 mt-8 lg:mt-16">
            <img
              src="/images/chef5.webp"
              alt="Chef 5"
              className="rounded-xl object-cover w-full h-auto lg:h-[260px] row-span-1"
              loading="lazy"
            />
            <img
              src="/images/chef8.webp"
              alt="Chef 8"
              className="rounded-xl object-cover w-full h-auto lg:h-[260px] row-span-1"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col  gap-2 lg:gap-5  ">
            <img
              src="/images/chef6.webp"
              alt="Chef 6"
              className="rounded-xl object-cover w-full h-auto lg:h-[300px] row-span-1"
              loading="lazy"
            />

            <img
              src="/images/chef9.webp"
              alt="Chef 9"
              className="rounded-xl object-cover w-full h-auto lg:h-[240px] row-span-2 col-span-1"
              loading="lazy"
            />
          </div>
          <div className=" flex flex-col  gap-2 lg:gap-5  mt-8 lg:mt-16">
            <img
              src="/images/chef7.webp"
              alt="Chef 7"
              className="rounded-xl object-cover w-full h-auto lg:h-[340px] row-span-2 "
              loading="lazy"
            />
            <img
              src="/images/chef10.webp"
              alt="Chef 10"
              className="rounded-xl object-cover w-full h-auto lg:h-[260px] row-span-1"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
