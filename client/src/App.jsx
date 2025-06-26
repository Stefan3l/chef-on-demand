import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// import pages
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProfiloPersonale from "./pages/dashboard/ProfiloPersonale.jsx";
import PublicChef from "./pages/PublicChef.jsx";

// import protected route
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Foto from "./pages/dashboard/Foto.jsx";
import Position from "./pages/dashboard/Position.jsx";
import Messaggi from "./pages/dashboard/Messaggi.jsx";
import Piatti from "./pages/dashboard/Piatti.jsx";
import MenuPage from "./pages/dashboard/MenuPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/chefs/preview/:previewUrl" element={<PublicChef />} />
        </Route>

        {/* Route protected */}

        <Route path="/chefs/:id" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profilo-personale"
            element={
              <ProtectedRoute>
                <ProfiloPersonale />
              </ProtectedRoute>
            }
          />
          <Route
            path="foto"
            element={
              <ProtectedRoute>
                <Foto />
              </ProtectedRoute>
            }
          />
          <Route
            path="position"
            element={
              <ProtectedRoute>
                <Position />
              </ProtectedRoute>
            }
          />
          <Route
            path="messaggi"
            element={
              <ProtectedRoute>
                <Messaggi />
              </ProtectedRoute>
            }
          />
          <Route
            path="piatti"
            element={
              <ProtectedRoute>
                <Piatti />
              </ProtectedRoute>
            }
          />
          <Route
            path="menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
