import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Stock from "./pages/Stock";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function App() {
  const user = localStorage.getItem("inventory_user");

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <Sidebar />

          <main className="main-content">
            <Navbar />

            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/products"
                element={<Products />}
              />

              <Route
                path="/categories"
                element={<Categories />}
              />

              <Route
                path="/stock"
                element={<Stock />}
              />

              <Route
                path="/suppliers"
                element={<Suppliers />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
