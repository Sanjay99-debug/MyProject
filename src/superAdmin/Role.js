import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Role() {
  const [countries, setCountries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editCountryId, setEditCountryId] = useState(null);
  const [editCountryName, setEditCountryName] = useState("");
  const [viewCountry, setViewCountry] = useState(null);

  // ✅ Fetch Roles from API
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await axios.get("https://localhost:7121/api/Roles");
      setCountries(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  // ✅ Add Role
  const handleAddCountry = async () => {
    if (newCountry.trim() === "") return;

    try {
      await axios.post("https://localhost:7121/api/Roles", {
        name: newCountry,
      });
      setNewCountry("");
      setShowAddModal(false);
      loadRoles(); // refresh data
    } catch (err) {
      console.error("Error adding role:", err);
    }
  };

  // ✅ Delete Role
  const handleDeleteCountry = (id) => {
    const country = countries.find((c) => c.id === id);

    Swal.fire({
      title: `Delete "${country.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${"https://localhost:7121/api/Roles"}/${id}`);
          loadRoles();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `"${country.name}" deleted`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (err) {
          console.error("Error deleting role:", err);
        }
      }
    });
  };

  // ✅ Edit
  const handleEditCountry = (country) => {
    setEditCountryId(country.id);
    setEditCountryName(country.name);
  };

  const handleUpdateCountry = async () => {
    if (editCountryName.trim() === "") return;

    try {
      await axios.put(
        `${"https://localhost:7121/api/Roles"}/${editCountryId}`,
        {
          name: editCountryName,
        }
      );
      setEditCountryId(null);
      setEditCountryName("");
      loadRoles();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDownload = () => {
    const csv = countries.map((c) => c.name).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "roles.csv";
    link.click();
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Heading and Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🌍 Role Management</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add Role
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-success btn-sm"
            onClick={handleDownload}
            title="Download CSV"
          >
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-4 text-md-end">
          <label className="form-label me-2 mb-0">Items per page:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th> Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCountries.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => handleEditCountry(c)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteCountry(c.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewCountry(c)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedCountries.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No countries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Role</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=" Name"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddCountry}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editCountryId !== null && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Country</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setEditCountryId(null);
                      setEditCountryName("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editCountryName}
                    onChange={(e) => setEditCountryName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditCountryId(null);
                      setEditCountryName("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateCountry}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewCountry && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Country Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewCountry(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {viewCountry.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {viewCountry.name}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewCountry(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Role;
