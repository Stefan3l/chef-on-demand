import { Outlet } from "react-router-dom";

// import components
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
export default function DefaultLayout() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
