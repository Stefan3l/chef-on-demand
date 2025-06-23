import axios from "axios";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Button from "./buttons/Button";

export default function RegisterForm({ isOpen, onClose }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email !== form.email) {
      setError("L'email non corrisponde");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/chefs", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      setSuccess("Registrazione avvenuta con successo");
      setError(null);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_email: "",
        phone: "",
      });

      //chiudo il modale dopo la registrazione
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Errore durante la registrazione. Riprova più tardi.");
      setSuccess("");
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90vw] sm:w-[420px] max-w-full rounded-3xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-2xl font-bold hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-center text-yellow-600 font-semibold text-xl mb-1">
          Become a chef
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">Join us today</p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            name="first_name"
            placeholder="Name *"
            className="text-b border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <input
            name="last_name"
            placeholder="Surname *"
            className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <PhoneInput
            country={"be"}
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
            inputClass="!w-full !rounded-full !pl-14 !pr-4 !py-6 !text-sm"
            containerClass="!w-full"
            buttonClass="!bg-white"
            enableSearch
            placeholder="Phone *"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email *"
            className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="confirm_email"
            type="email"
            placeholder="Confirm your email *"
            className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.confirm_email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300 w-full"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none "
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  height="20"
                  width="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.25 0-9.3-4.5-9.9-5.25a.6.6 0 010-.75c.6-.75 4.65-5.25 9.9-5.25s9.3 4.5 9.9 5.25a.6.6 0 010 .75c-.3.375-1.143 1.312-2.25 2.1M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  height="20"
                  width="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18M9.879 9.879a3 3 0 004.242 4.242m1.255 1.255C14.463 17.049 13.263 17.5 12 17.5c-5.25 0-9.3-4.5-9.9-5.25a.6.6 0 010-.75c.318-.398 1.335-1.552 2.805-2.45M12 6.5c1.263 0 2.463.451 3.377 1.174M21 21L3 3"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" required />
            <p className="text-sm text-gray-600">
              I accept the{" "}
              <span className="font-medium underline cursor-pointer">
                terms and conditions
              </span>{" "}
              as well as the{" "}
              <span className="font-medium underline cursor-pointer">
                privacy policy
              </span>
              .
            </p>
          </div>

          <Button type="submit" className="w-full py-4 mt-4" variant="yellow">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
