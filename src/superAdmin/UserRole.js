/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function UserRole() {
  const [userRoles, setUserRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [newUserRole, setNewUserRole] = useState({
    userId: "",
    roleId: "",
  });

  const [editUserRole, setEditUserRole] = useState(null);
  const [viewUserRole, setViewUserRole] = useState(null);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      const res = await axios.get("https://localhost:7121/api/UserRoles");
      setUserRoles(res.data);
    } catch (err) {
      console.error("Error fetching user roles:", err);
    }
  };

  const handleAddUserRole = async () => {
    const { userId, roleId } = newUserRole;
    if (!userId || !roleId) return;

    try {
      await axios.post("https://localhost:7121/api/UserRoles", newUserRole);
      setNewUserRole({ userId: "", roleId: "" });
      setShowAddModal(false);
      loadUserRoles();
    } catch (err) {
      console.error("Error adding user role:", err);
    }
  };

  const handleDeleteUserRole = (id) => {
    const userRole = userRoles.find((ur) => ur.id === id);

    Swal.fire({
      title: `Delete entry with ID ${id}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://localhost:7121/api/UserRoles/${id}`);
          loadUserRoles();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `UserRole ${id} deleted`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (err) {
          console.error("Error deleting user role:", err);
        }
      }
    });
  };

  const handleUpdateUserRole = async () => {
    try {
      await axios.put(`https://localhost:7121/api/UserRoles/${editUserRole.id}`, editUserRole);
      setEditUserRole(null);
      loadUserRoles();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDownload = () => {
    const csv = userRoles
      .map((ur) => `${ur.id},${ur.userId},${ur.roleId}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "user_roles.csv";
    link.click();
  };

  const filteredUserRoles = userRoles.filter((ur) =>
    ur.userId.toString().includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUserRoles = filteredUserRoles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredUserRoles.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🔐 User Role Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Add UserRole
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by user ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success btn-sm" onClick={handleDownload}>
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
            <th>User ID</th>
            <th>Role ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUserRoles.map((ur) => (
            <tr key={ur.id}>
              <td>{ur.id}</td>
              <td>{ur.userId}</td>
              <td>{ur.roleId}</td>
              <td>
                <button className="border-0 bg-transparent me-2" onClick={() => setEditUserRole({ ...ur })}>
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button className="border-0 bg-transparent me-2" onClick={() => handleDeleteUserRole(ur.id)}>
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button className="border-0 bg-transparent" onClick={() => setViewUserRole(ur)}>
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedUserRoles.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add UserRole</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="User ID"
                    value={newUserRole.userId}
                    onChange={(e) => setNewUserRole({ ...newUserRole, userId: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Role ID"
                    value={newUserRole.roleId}
                    onChange={(e) => setNewUserRole({ ...newUserRole, roleId: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddUserRole}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editUserRole && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit UserRole</h5>
                  <button type="button" className="btn-close" onClick={() => setEditUserRole(null)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editUserRole.userId}
                    onChange={(e) => setEditUserRole({ ...editUserRole, userId: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control"
                    value={editUserRole.roleId}
                    onChange={(e) => setEditUserRole({ ...editUserRole, roleId: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditUserRole(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateUserRole}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewUserRole && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">UserRole Details</h5>
                  <button type="button" className="btn-close" onClick={() => setViewUserRole(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewUserRole.id}</p>
                  <p><strong>User ID:</strong> {viewUserRole.userId}</p>
                  <p><strong>Role ID:</strong> {viewUserRole.roleId}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewUserRole(null)}>Close</button>
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

export default UserRole;
