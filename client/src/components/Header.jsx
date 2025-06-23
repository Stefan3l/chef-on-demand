import { useState } from "react";
import { Menu } from "lucide-react";

//import components
import Logo from "./logo/Logo";
import NavBar from "./header/NavBar";
import AccessPanel from "./header/AccessPanel";
import MobileMenu from "./Mobile/MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#FFFFFF] text-[#182427] p-4">
      <div className="flex items-center justify-between">
        <Logo />

        {/* Buton hamburger vizibil doar pe mobil */}
        <button
          className="flex flex-col gap-2 lg:hidden text-[#182427] cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          <span className="w-8 h-0.5 bg-[#182427] rounded-sm"></span>
          <span className="w-8 h-1 bg-[#182427] rounded-sm"></span>
        </button>

        {/* NavBar și AccessPanel doar pe desktop */}
        <div className="hidden lg:flex items-center gap-6">
          <NavBar />
          <AccessPanel />
        </div>
      </div>

      {/* MobileMenu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
