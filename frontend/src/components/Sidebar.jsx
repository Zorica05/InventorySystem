function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Inventory</h2>

      <nav>
        <a href="/">Dashboard</a>
        <a href="/products">Products</a>
        <a href="/categories">Categories</a>
        <a href="/suppliers">Suppliers</a>
        <a href="/stock">Stock</a>
        <a href="/reports">Reports</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
