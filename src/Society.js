import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Society() {
  const [societies, setSocieties] = useState([
    {
      id: 1,
      name: "Sunview Enclave",
      noOfHouses: 50,
      address: "Ferozepur Road",
      city: "Ludhiana",
      pincode: "141001",
    },
    {
      id: 2,
      name: "Centra Greens",
      noOfHouses: 30,
      address: "Pakhowal Road",
      city: "Ludhiana",
      pincode: "141002",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSocietyData, setNewSocietyData] = useState({
    name: "",
    noOfHouses: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [editSocietyData, setEditSocietyData] = useState(null);
  const [viewSociety, setViewSociety] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleAddSociety = () => {
    if (newSocietyData.name.trim() !== "") {
      const newId =
        societies.length > 0 ? Math.max(...societies.map((s) => s.id)) + 1 : 1;
      setSocieties([...societies, { id: newId, ...newSocietyData }]);
      setNewSocietyData({
        name: "",
        noOfHouses: "",
        address: "",
        city: "",
        pincode: "",
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteSociety = (id) => {
    const society = societies.find((s) => s.id === id);
    Swal.fire({
      title: `Delete "${society.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
    }).then((result) => {
      if (result.isConfirmed) {
        setSocieties(societies.filter((s) => s.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${society.name}" deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleUpdateSociety = () => {
    setSocieties(
      societies.map((s) =>
        s.id === editSocietyData.id ? { ...editSocietyData } : s
      )
    );
    setEditSocietyData(null);
  };

  const handleDownload = () => {
    const headers = "ID,Name,No of Houses,Address,City,Pincode\n";
    const csv = societies
      .map(
        (s) =>
          `${s.id},"${s.name}",${s.noOfHouses},"${s.address}","${s.city}",${s.pincode}`
      )
      .join("\n");
    const blob = new Blob([headers + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "societies.csv";
    link.click();
  };

  const filteredSocieties = societies.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSocieties = filteredSocieties.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredSocieties.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🏢 Add New Society</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add Society
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
          <button className="btn btn-success btn-sm" onClick={handleDownload}>
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-4 text-end">
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
        <thead className="table-dark ">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Houses</th>
            <th>Address</th>
            <th>City</th>
            <th>Pincode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSocieties.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.noOfHouses}</td>
              <td>{s.address}</td>
              <td>{s.city}</td>
              <td>{s.pincode}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => setEditSocietyData(s)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteSociety(s.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewSociety(s)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedSocieties.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No societies found.
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
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Society</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {["name", "noOfHouses", "address", "city", "pincode"].map(
                    (field) => (
                      <input
                        key={field}
                        type={field === "noOfHouses" ? "number" : "text"}
                        className="form-control mb-2"
                        placeholder={field.replace(/([A-Z])/g, " $1")}
                        value={newSocietyData[field]}
                        onChange={(e) =>
                          setNewSocietyData({
                            ...newSocietyData,
                            [field]: e.target.value,
                          })
                        }
                      />
                    )
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddSociety}>
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
      {editSocietyData && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Society</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditSocietyData(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  {["name", "noOfHouses", "address", "city", "pincode"].map(
                    (field) => (
                      <input
                        key={field}
                        type={field === "noOfHouses" ? "number" : "text"}
                        className="form-control mb-2"
                        value={editSocietyData[field]}
                        onChange={(e) =>
                          setEditSocietyData({
                            ...editSocietyData,
                            [field]: e.target.value,
                          })
                        }
                      />
                    )
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditSocietyData(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateSociety}>
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
      {viewSociety && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Society Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewSociety(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewSociety.id}</p>
                  <p><strong>Name:</strong> {viewSociety.name}</p>
                  <p><strong>Houses:</strong> {viewSociety.noOfHouses}</p>
                  <p><strong>Address:</strong> {viewSociety.address}</p>
                  <p><strong>City:</strong> {viewSociety.city}</p>
                  <p><strong>Pincode:</strong> {viewSociety.pincode}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewSociety(null)}
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

export default Society;
