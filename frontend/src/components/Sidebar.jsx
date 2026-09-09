import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Inventory</h2>
        <p>Management System</p>
      </div>

      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/stock"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Stock
        </NavLink>

        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Suppliers
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
