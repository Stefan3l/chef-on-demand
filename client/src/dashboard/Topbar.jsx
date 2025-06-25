import { useState, useEffect, useRef } from "react";

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const chef = JSON.parse(localStorage.getItem("chef"));
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

  // 👇 închide meniul dacă dai click în afara lui
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
              onClick={handleLogout}
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
