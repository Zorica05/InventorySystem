import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/categories.php"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load categories.");
      }

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingCategory(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    const isEditing = Boolean(editingCategory);

    const url = isEditing
      ? "http://localhost:8080/update-category.php"
      : "http://localhost:8080/add-category.php";

    const method = isEditing ? "PUT" : "POST";

    const body = isEditing
      ? {
          id: editingCategory.id,
          name: categoryName,
        }
      : {
          name: categoryName,
        };

    try {
      setError("");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing
              ? "Failed to update category."
              : "Failed to add category.")
        );
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      console.error("Category error:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setError("");
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/delete-category.php",
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
        throw new Error(
          data.error || "Failed to delete category."
        );
      }

      if (editingCategory?.id === id) {
        resetForm();
      }

      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <section className="dashboard-content">
        <h2>Categories</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h2>Categories</h2>
          <p>Manage your product categories.</p>
        </div>
      </div>

      <div className="category-form-card">
        <h3>
          {editingCategory ? "Edit Category" : "Add Category"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="category-form"
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button type="submit">
            {editingCategory
              ? "Update Category"
              : "+ Add Category"}
          </button>

          {editingCategory && (
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>

        {error && (
          <p className="category-error">
            {error}
          </p>
        )}
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>

                  <td>{category.name}</td>

                  <td>
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() => startEditing(category)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCategory(category.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
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

export default Categories;
