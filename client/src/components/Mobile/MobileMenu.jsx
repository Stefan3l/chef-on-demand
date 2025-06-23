import { motion } from "framer-motion";

// import components
import Logo from "../logo/Logo";
import AccessPanel from "../header/AccessPanel";

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <div className="block lg:hidden ">
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed  inset-0 z-50 bg-[#182427] text-[#8C9293] flex flex-col p-6 space-y-6"
        >
          <div className="flex justify-between items-center mb-6 text-white">
            <Logo />

            <button
              onClick={onClose}
              className="self-end text-white text-4xl cursor-pointer"
            >
              ×
            </button>
          </div>
          <hr className="w-screen relative left-1/2 right-1/2 -mx-[50vw] " />

          <nav className="flex flex-col gap-4 text-xl ">
            <a className="hover:text-white" href="#">
              Home
            </a>
            <a className="hover:text-white" href="#">
              The Experience
            </a>
            <a className="hover:text-white" href="#">
              Our Chefs
            </a>
            <a className="hover:text-white" href="#">
              Chef register
            </a>
            <a className="hover:text-white" href="#">
              Gift
            </a>
            <a className="hover:text-white" href="#">
              Contact us
            </a>
            <a className="hover:text-white" href="#">
              Explore More{" "}
            </a>
          </nav>

          <div className="mt-4 flex gap-2 text-lg font-semibold">
            <span className="hover:text-white">EN</span>
            <span className="text-[#8c9293c7] hover:text-white">ES</span>
          </div>
          <div className="flex gap-4 mt-auto">
            <AccessPanel isMobile />
          </div>
        </motion.div>
      )}
    </div>
  );
}
