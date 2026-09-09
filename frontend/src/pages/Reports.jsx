import { useEffect, useState } from "react";

function Reports() {
  const [report, setReport] = useState({
    summary: {
      total_products: 0,
      total_stock: 0,
      total_value: 0,
      low_stock: 0,
      out_of_stock: 0,
    },
    top_products: [],
    category_summary: [],
    movement_summary: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/reports.php"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load reports."
        );
      }

      setReport(data);
    } catch (error) {
      console.error("Error fetching reports:", error);

      setError(
        error.message || "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <section className="dashboard-content">
        <h2>Reports</h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Reports</h2>
            <p>Inventory reports and statistics.</p>
          </div>
        </div>

        <p className="category-error">{error}</p>

        <button
          className="add-product-button"
          onClick={loadReports}
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section
      className="dashboard-content report-page"
      id="report-print-area"
    >
      <div className="dashboard-header report-header">
        <div>
          <h2>Inventory Report</h2>
          <p>
            Inventory reports and statistics.
          </p>
        </div>

        <div className="report-actions no-print">
          <button
            className="add-product-button"
            onClick={loadReports}
          >
            Refresh
          </button>

          <button
            className="print-button"
            onClick={printReport}
          >
            🖨 Print Report
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Products
          </span>

          <strong className="dashboard-card-value">
            {report.summary.total_products}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Total Stock
          </span>

          <strong className="dashboard-card-value">
            {report.summary.total_stock}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Inventory Value
          </span>

          <strong className="dashboard-card-value">
            €
            {Number(
              report.summary.total_value
            ).toFixed(2)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Low Stock
          </span>

          <strong className="dashboard-card-value warning">
            {report.summary.low_stock}
          </strong>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-label">
            Out of Stock
          </span>

          <strong className="dashboard-card-value danger">
            {report.summary.out_of_stock}
          </strong>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-products">
          <div className="recent-products-header">
            <div>
              <h3>Top Products</h3>
              <p>
                Products with the highest stock value.
              </p>
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
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                {report.top_products.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  report.top_products.map(
                    (product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td>
                          €
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </td>
                        <td>{product.quantity}</td>
                        <td>
                          €
                          {Number(
                            product.stock_value
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="low-stock-section">
          <div className="recent-products-header">
            <div>
              <h3>Stock Movements</h3>
              <p>
                Inventory movement summary.
              </p>
            </div>
          </div>

          <div className="low-stock-list">
            {report.movement_summary.length === 0 ? (
              <div className="no-low-stock">
                <span>✓</span>
                <p>No stock movements found.</p>
              </div>
            ) : (
              report.movement_summary.map(
                (movement) => (
                  <div
                    className="low-stock-item"
                    key={movement.type}
                  >
                    <div>
                      <strong>
                        {movement.type}
                      </strong>

                      <span>
                        {movement.movement_count}{" "}
                        movements
                      </span>
                    </div>

                    <div className="low-stock-quantity">
                      <strong>
                        {movement.total_quantity}
                      </strong>

                      <span>units</span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      <div className="recent-products">
        <div className="recent-products-header">
          <div>
            <h3>Category Summary</h3>
            <p>
              Inventory distribution by category.
            </p>
          </div>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Stock</th>
                <th>Inventory Value</th>
              </tr>
            </thead>

            <tbody>
              {report.category_summary.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    No categories found.
                  </td>
                </tr>
              ) : (
                report.category_summary.map(
                  (category) => (
                    <tr key={category.category}>
                      <td>{category.category}</td>
                      <td>
                        {category.product_count}
                      </td>
                      <td>
                        {category.total_stock}
                      </td>
                      <td>
                        €
                        {Number(
                          category.total_value
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-footer">
        <p>
          Generated on{" "}
          {new Date().toLocaleString()}
        </p>
      </div>
    </section>
  );
}

export default Reports;
