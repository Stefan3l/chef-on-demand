import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import DefaultLayout from "./layouts/DefaultLayout.jsx";

// import pages
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
