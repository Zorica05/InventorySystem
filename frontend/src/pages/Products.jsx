import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadProducts = () => {
    fetch("http://localhost:8080/products.php")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddForm = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/delete-product.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete product.");
        return;
      }

      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Something went wrong.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product) => {
    const quantity = Number(product.quantity);
    const minQuantity = Number(product.min_quantity);

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "status-out",
      };
    }

    if (quantity <= minQuantity) {
      return {
        label: "Low Stock",
        className: "status-low",
      };
    }

    return {
      label: "In Stock",
      className: "status-in",
    };
  };

  return (
    <section className="dashboard-content">
      <div className="dashboard-header products-header">
        <div>
          <h2>Products</h2>
          <p>Manage your inventory products.</p>
        </div>

        <button
          className="add-product-button"
          onClick={openAddForm}
        >
          + Add Product
        </button>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);

              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>€{product.price}</td>
                  <td>{product.quantity}</td>

                  <td>
                    <span className={`stock-status ${status.className}`}>
                      {status.label}
                    </span>
                  </td>

                  <td>
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() => openEditForm(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={closeForm}
          onProductSaved={loadProducts}
        />
      )}
    </section>
  );
}

export default Products;
