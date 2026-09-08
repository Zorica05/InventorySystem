function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-title">
        <h1>Dashboard</h1>
        <p>Welcome back!</p>
      </div>

      <div className="navbar-user">
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
