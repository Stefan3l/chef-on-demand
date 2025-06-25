// import components
import Button from "../buttons/Button";

export default function BioChef({ chefData }) {
  return (
    <section className="max-w-[1400px] mx-auto bg-[#FFFFFF] pt-20 pb-10 px-4 lg:px-14 rounded-t-2xl lg:rounded-2xl shadow-lg mt-[-50px] z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col  items-center lg:items-start gap-6 ">
          <h2 className="text-2xl lg:text-4xl font-semibold">Conosci meglio</h2>
          <p className="text-xl italic">"Cucina Italiana tradizionale."</p>
          <div className="">
            <Button variant="yellow" className=" py-4 px-10 ">
              Prenota
            </Button>
          </div>
        </div>
        <div>
          <p>{chefData.bio}</p>
        </div>
        <div>
          <img
            src={`http://localhost:3000/${chefData.profileImage}`}
            alt={chefData.first_name + " " + chefData.last_name}
            className="w-full h-auto  lg:h-[440px] rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
      <hr className="my-20 text-gray-700 hidden lg:block" />
      <h3 className="text-2xl lg:text-2xl font-semibold mb-8 mt-8 lg:mt-0">
        Chef Italiano
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Parlo della cucina...</p>
          <p className="text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos harum
            delectus dolor impedit alias repellendus maiores, aspernatur quis
            provident possimus odit
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Inizia a cucinare...</p>
          <p className="text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos harum
            delectus dolor impedit alias repellendus maiores, aspernatur quis
            provident possimus odit
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Un secreto...</p>
          <p className="text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos harum
            delectus dolor impedit alias repellendus maiores, aspernatur quis
            provident possimus odit
          </p>
        </div>
      </div>
    </section>
  );
}
