import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [openProfilo, setOpenProfilo] = useState(false);
  const [openProposte, setOpenProposte] = useState(false);
  const { id } = useParams();

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col border-r border-gray-200 text-sm">
      <div className="mb-6">
        <NavLink to={`/chefs/${id}/dashboard`}>
          <img
            src="/images/logo.webp"
            alt="Logo"
            className="w-44 h-14 mb-6 cursor-pointer"
          />
        </NavLink>
      </div>

      <nav className="flex flex-col gap-3 text-lg text-gray-700">
        <NavLink to="#" className="hover:text-purple-700">
          Inizio
        </NavLink>
        <NavLink to="#">Richieste</NavLink>
        <NavLink to="#">Messaggi</NavLink>
        <NavLink to="#">Calendario</NavLink>

        <button
          onClick={() => setOpenProfilo(!openProfilo)}
          className="flex justify-between items-center text-left text-gray-700 "
        >
          <span className="">Profilo</span>
          <span>
            {openProfilo ? (
              <i class="fa-solid fa-angle-up"></i>
            ) : (
              <i class="fa-solid fa-angle-down"></i>
            )}
          </span>
        </button>
        {openProfilo && (
          <div className=" flex flex-col gap-1 mt-1 text-gray-600">
            <NavLink to={`/chefs/${id}/profilo-personale`}>
              Profilo Personale
            </NavLink>
            <NavLink to={`/chefs/${id}/foto`}>Foto</NavLink>
            <NavLink to={`/chefs/${id}/position`}>Dove sei?</NavLink>
            <NavLink to="#">Coordinate Bancarie</NavLink>
          </div>
        )}

        <button
          onClick={() => setOpenProposte(!openProposte)}
          className="flex justify-between items-center text-left text-gray-700 "
        >
          <span className="">Proposte Gastronomiche</span>
          <span>
            {openProposte ? (
              <i class="fa-solid fa-angle-up"></i>
            ) : (
              <i class="fa-solid fa-angle-down"></i>
            )}
          </span>
        </button>
        {openProposte && (
          <div className=" flex flex-col gap-1 mt-1 text-gray-600">
            <NavLink to="#">Menu</NavLink>
            <NavLink to="#">Piatti</NavLink>
          </div>
        )}

        <NavLink to="#">Richiedi Impostazioni</NavLink>
        <NavLink to="#">Partners</NavLink>

        <hr className="my-4" />

        <NavLink to="#">Centro assistenza</NavLink>
        <NavLink to="#" className="">
          Logout
        </NavLink>
      </nav>
    </aside>
  );
}
