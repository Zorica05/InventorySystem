import { useEffect, useState } from "react";

function Stock() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState("in");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [productsResponse, stockResponse] =
        await Promise.all([
          fetch("http://localhost:8080/products.php"),
          fetch("http://localhost:8080/stock.php"),
        ]);

      const productsData = await productsResponse.json();
      const stockData = await stockResponse.json();

      if (!productsResponse.ok) {
        throw new Error("Failed to load products.");
      }

      if (!stockResponse.ok) {
        throw new Error("Failed to load stock movements.");
      }

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setMovements(
        Array.isArray(stockData)
          ? stockData
          : []
      );
    } catch (error) {
      console.error("Error loading stock:", error);
      setError("Failed to load stock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:8080/add-stock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: Number(productId),
            type,
            quantity: Number(quantity),
            note: note.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update stock."
        );
      }

      setQuantity("");
      setNote("");

      await loadData();
    } catch (error) {
      console.error("Error updating stock:", error);
      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="dashboard-content">
        <h2>Stock</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h2>Stock</h2>
          <p>Manage stock in and stock out movements.</p>
        </div>
      </div>

      <div className="stock-form-card">
        <h3>Update Stock</h3>

        <form
          className="stock-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Product</label>

            <select
              value={productId}
              onChange={(event) =>
                setProductId(event.target.value)
              }
              required
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — Stock: {product.quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Movement</label>

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >
                <option value="in">
                  Stock In
                </option>

                <option value="out">
                  Stock Out
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="Enter quantity"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Note</label>

            <input
              type="text"
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="e.g. New delivery"
            />
          </div>

          {error && (
            <p className="category-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Stock"}
          </button>
        </form>
      </div>

      <div className="products-table-container stock-history">
        <div className="stock-history-header">
          <div>
            <h3>Stock History</h3>
            <p>
              Recent stock movements.
            </p>
          </div>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No stock movements found.
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.product_name}</td>
                  <td>{movement.sku}</td>

                  <td>
                    <span
                      className={`stock-movement-type ${movement.type}`}
                    >
                      {movement.type === "in"
                        ? "Stock In"
                        : "Stock Out"}
                    </span>
                  </td>

                  <td>
                    {movement.type === "in"
                      ? "+"
                      : "-"}
                    {movement.quantity}
                  </td>

                  <td>
                    {movement.note || "-"}
                  </td>

                  <td>
                    {movement.created_at}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Stock;
