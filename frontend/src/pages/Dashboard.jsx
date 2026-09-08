import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_stock: 0,
    total_value: 0,
    low_stock: 0,
    out_of_stock: 0,
    recent_products: [],
    low_stock_products: [],
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    fetch("http://localhost:8080/dashboard.php")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your inventory.</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Products
          </span>

          <strong className="dashboard-card-value">
            {stats.total_products}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Stock
          </span>

          <strong className="dashboard-card-value">
            {stats.total_stock}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Inventory Value
          </span>

          <strong className="dashboard-card-value">
            €{stats.total_value.toFixed(2)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Low Stock
          </span>

          <strong className="dashboard-card-value warning">
            {stats.low_stock}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Out of Stock
          </span>

          <strong className="dashboard-card-value danger">
            {stats.out_of_stock}
          </strong>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-products">
          <div className="recent-products-header">
            <div>
              <h3>Recent Products</h3>
              <p>Latest products added to your inventory.</p>
            </div>
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {stats.recent_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>€{product.price}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="low-stock-section">
          <div className="recent-products-header">
            <div>
              <h3>Low Stock</h3>
              <p>Products that need attention.</p>
            </div>
          </div>

          <div className="low-stock-list">
            {stats.low_stock_products.length === 0 ? (
              <div className="no-low-stock">
                <span>✓</span>
                <p>All products have sufficient stock.</p>
              </div>
            ) : (
              stats.low_stock_products.map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.sku}</span>
                  </div>

                  <div className="low-stock-quantity">
                    <strong>{product.quantity}</strong>
                    <span>left</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
