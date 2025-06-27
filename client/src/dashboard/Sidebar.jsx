import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useUnreadMessages } from "../components/contexts/UnreadMessagesContext";

export default function Sidebar() {
  const [openProfilo, setOpenProfilo] = useState(false);
  const [openProposte, setOpenProposte] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { unreadCount, setUnreadCount } = useUnreadMessages();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages?chefId=${id}`);
        const unread = res.data.filter((msg) => !msg.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Errore nel recupero dei messaggi:", error);
      }
    };

    if (id) fetchUnreadMessages();
  }, [id, setUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("chef");
    window.location.href = "/";
  };

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
        <NavLink
          to={`/chefs/${id}/dashboard`}
          className="hover:text-purple-700"
        >
          Inizio
        </NavLink>

        <NavLink to="#">Richieste</NavLink>

        <NavLink
          to={`/chefs/${id}/messaggi`}
          className="flex justify-between items-center"
        >
          <span>Messaggi</span>
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink to="#">Calendario</NavLink>

        <button
          onClick={() => setOpenProfilo(!openProfilo)}
          className="flex justify-between items-center text-left text-gray-700"
        >
          <span>Profilo</span>
          <span>
            {openProfilo ? (
              <i className="fa-solid fa-angle-up"></i>
            ) : (
              <i className="fa-solid fa-angle-down"></i>
            )}
          </span>
        </button>

        {openProfilo && (
          <div className="flex flex-col gap-1 mt-1 text-gray-600">
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
          className="flex justify-between items-center text-left text-gray-700"
        >
          <span>Proposte Gastronomiche</span>
          <span>
            {openProposte ? (
              <i className="fa-solid fa-angle-up"></i>
            ) : (
              <i className="fa-solid fa-angle-down"></i>
            )}
          </span>
        </button>

        {openProposte && (
          <div className="flex flex-col gap-1 mt-1 text-gray-600">
            <NavLink to={`/chefs/${id}/menu`}>Menu</NavLink>
            <NavLink to={`/chefs/${id}/piatti`}>Piatti</NavLink>
          </div>
        )}

        <NavLink to="#">Richiedi Impostazioni</NavLink>
        <NavLink to="#">Partners</NavLink>

        <hr className="my-4" />

        <NavLink to="#">Centro assistenza</NavLink>

        <button
          className="cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>

        {/* Modal Logout */}
        <Dialog
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
              <Dialog.Title className="text-lg font-bold">
                Conferma Logout
              </Dialog.Title>
              <p className="text-sm text-gray-600">
                Sei sicuro di voler uscire?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-gray-600 hover:underline"
                >
                  Annulla
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </nav>
    </aside>
  );
}
