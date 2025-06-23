import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSelect() {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className="relative  text-left hidden lg:block">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-16 px-3 py-1 text-sm font-medium bg-white  cursor-pointer"
      >
        EN
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 w-16 mt-1 bg-[#F0EFEF]  shadow-md"
          >
            <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">EN</li>
            <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">ES</li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
