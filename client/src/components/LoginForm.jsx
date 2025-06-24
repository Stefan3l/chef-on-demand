import axios from "axios";
import { useState, useEffect } from "react";
import Button from "./buttons/Button";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setIsLogin({ ...isLogin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email: isLogin.email,
        password: isLogin.password,
      });

      const { token, chef } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("chef", JSON.stringify(chef));

      setSuccess("Login successful!");
      setError(null);

      // Chiudo il modale dopo il login
      setTimeout(() => {
        onClose();
        navigate(`/chefs/${chef.id}/dashboard`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
      setSuccess(null);
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
          Chef Login
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Si eres cliente, gestiona tu solicitud. Si eres Chef, gestiona tus
          servicios, platos y menús.
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email *"
            className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
            value={isLogin.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              className="border rounded-full px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-yellow-300 w-full"
              value={isLogin.password}
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

          <Button type="submit" className="w-full py-4 mt-2" variant="yellow">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
