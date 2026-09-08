import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
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

  const addCategory = async (event) => {
    event.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/add-category.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add category.");
      }

      setName("");

      await loadCategories();
    } catch (error) {
      console.error("Error adding category:", error);
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
        <h3>Add Category</h3>

        <form
          onSubmit={addCategory}
          className="category-form"
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button type="submit">
            + Add Category
          </button>
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
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
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
