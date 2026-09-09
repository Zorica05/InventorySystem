import { useEffect, useState } from "react";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(selectedSupplier);

  const loadSuppliers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/suppliers.php"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load suppliers."
        );
      }

      setSuppliers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);
      setError("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setSelectedSupplier(null);
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (supplier) => {
    setSelectedSupplier(supplier);

    setName(supplier.name || "");
    setEmail(supplier.email || "");
    setPhone(supplier.phone || "");
    setAddress(supplier.address || "");

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    const supplierData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    if (isEditing) {
      supplierData.id = selectedSupplier.id;
    }

    const url = isEditing
      ? "http://localhost:8080/update-supplier.php"
      : "http://localhost:8080/add-supplier.php";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save supplier."
        );
      }

      closeForm();
      await loadSuppliers();
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSupplier = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/delete-supplier.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete supplier."
        );
      }

      await loadSuppliers();
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Something went wrong."
      );
    }
  };

  if (loading) {
    return (
      <section className="dashboard-content">
        <h2>Suppliers</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-content">
      <div className="dashboard-header products-header">
        <div>
          <h2>Suppliers</h2>
          <p>Manage your inventory suppliers.</p>
        </div>

        <button
          className="add-product-button"
          onClick={openAddForm}
        >
          + Add Supplier
        </button>
      </div>

      {error && !showForm && (
        <p className="category-error">
          {error}
        </p>
      )}

      {showForm && (
        <div className="supplier-form-card">
          <div className="supplier-form-header">
            <div>
              <h3>
                {isEditing
                  ? "Edit Supplier"
                  : "Add Supplier"}
              </h3>

              <p>
                {isEditing
                  ? "Update supplier information."
                  : "Add a new supplier to your inventory."}
              </p>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={closeForm}
            >
              ×
            </button>
          </div>

          <form
            className="supplier-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Supplier Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Tech Supply"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="supplier@example.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+389 70 123 456"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>

              <input
                type="text"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Supplier address"
              />
            </div>

            {error && (
              <p className="category-error">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Supplier"
                    : "Save Supplier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="7">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>

                  <td>{supplier.name}</td>

                  <td>
                    {supplier.email || "-"}
                  </td>

                  <td>
                    {supplier.phone || "-"}
                  </td>

                  <td>
                    {supplier.address || "-"}
                  </td>

                  <td>
                    {supplier.created_at}
                  </td>

                  <td>
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() =>
                          openEditForm(supplier)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteSupplier(
                            supplier.id
                          )
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

export default Suppliers;
