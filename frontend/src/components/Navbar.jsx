import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/": "Dashboard",
    "/products": "Products",
    "/categories": "Categories",
  };

  const pageDescriptions = {
    "/": "Welcome back!",
    "/products": "Manage your inventory products.",
    "/categories": "Manage your product categories.",
  };

  const title = pageTitles[location.pathname] || "Inventory";

  const description =
    pageDescriptions[location.pathname] ||
    "Inventory management system.";

  const handleLogout = () => {
    localStorage.removeItem("inventory_user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div>
        <h1 className="navbar-title">{title}</h1>
        <p>{description}</p>
      </div>

      <div className="navbar-user">
        <div className="navbar-avatar">
          A
        </div>

        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
