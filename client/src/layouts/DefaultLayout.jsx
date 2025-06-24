import { Outlet } from "react-router-dom";
import { useState } from "react";

// import components
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LoginForm from "../components/LoginForm.jsx";

export default function DefaultLayout() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#F0EFEF]">
      <Header onLoginClick={() => setShowLoginForm(true)} />
      <main className="max-w-[1600px] mx-auto lg:px-4 py-8 ">
        <Outlet />
      </main>
      <Footer />
      <LoginForm
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
      />
    </div>
  );
}
