import { useParams } from "react-router-dom";

// import components
import ChefMessages from "../../dashboard/ChefMessages";

export default function Messaggi() {
  const { id } = useParams();
  return (
    <section className="max-w-[1400px] mx-auto bg-[#FFFFFF] pt-10 pb-10 px-4 lg:px-14 rounded-t-2xl lg:rounded-2xl shadow-lg mt-[-50px] z-10 relative">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Messaggi</h1>
        <p className="text-lg text-gray-600 mb-8">
          Gestisci i tuoi messaggi con i clienti
        </p>
      </div>
      <ChefMessages chefId={id} />
    </section>
  );
}
