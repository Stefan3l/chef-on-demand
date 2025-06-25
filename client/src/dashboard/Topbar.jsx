import { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const chef = JSON.parse(localStorage.getItem("chef"));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);

  const firstName = chef?.first_name || "";
  const lastName = chef?.last_name || "";
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Chef";
  const initials =
    firstName || lastName
      ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
      : "US";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("chef");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center border-b-2 border-gray-200 relative">
      <h2 className="text-xl font-semibold">
        Benvenuto{firstName ? `, ${firstName}` : ""}
      </h2>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {initials}
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

        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4 space-y-3 z-50">
            <div className="text-lg font-bold">{fullName}</div>
            <button className="text-left w-full text-gray-700 hover:underline">
              Il mio account
            </button>
            <button className="text-left w-full text-gray-700 hover:underline">
              Cambia password
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-left w-full text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
