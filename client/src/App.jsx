import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// import pages
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profilo from "./pages/dashboard/Profilo.jsx";

// import protected route
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
        </Route>

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
            path="profilo"
            element={
              <ProtectedRoute>
                <Profilo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
