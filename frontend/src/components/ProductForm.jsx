import { useEffect, useState } from "react";

function ProductForm({ product, onClose, onProductSaved }) {
  const isEditing = Boolean(product);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const response = await fetch(
          "http://localhost:8080/categories.php"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load categories.");
        }

        const loadedCategories = Array.isArray(data) ? data : [];

        setCategories(loadedCategories);

        if (product) {
          const existingCategory = loadedCategories.find(
            (item) => item.name === product.category
          );

          setCategory(
            existingCategory ? existingCategory.name : ""
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [product]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSku(product.sku || "");
      setPrice(product.price ?? "");
      setQuantity(product.quantity ?? "");
      setMinQuantity(product.min_quantity ?? "");
    } else {
      setName("");
      setSku("");
      setCategory("");
      setPrice("");
      setQuantity("");
      setMinQuantity("");
    }
  }, [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!category) {
      setCategoryError("Please select a category.");
      return;
    }

    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      price,
      quantity,
      min_quantity: minQuantity,
    };

    if (isEditing) {
      productData.id = product.id;
    }

    const url = isEditing
      ? "http://localhost:8080/update-product.php"
      : "http://localhost:8080/create-product.php";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save product.");
        return;
      }

      onProductSaved();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <div className="product-form-header">
          <div>
            <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

            <p>
              {isEditing
                ? "Update product information."
                : "Create a new inventory product."}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Logitech MX Master 3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU</label>

              <input
                type="text"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                placeholder="e.g. LOG-MX3-002"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setCategoryError("");
                }}
                required
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              {categoryError && (
                <p className="category-error">
                  {categoryError}
                </p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Minimum Quantity</label>

            <input
              type="number"
              min="0"
              value={minQuantity}
              onChange={(event) => setMinQuantity(event.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={loadingCategories}
            >
              {isEditing ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
