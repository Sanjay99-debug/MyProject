import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function AddHouse() {
  const societyOptions = ["Sunview Enclave", "Centra Greens", "DLF PKL"];
  const houseTypeOptions = ["1 BHK", "2 BHK", "3 BHK"];

  const [houses, setHouses] = useState([
    {
      id: 1,
      houseNo: "A-101",
      block: "A",
      houseType: "2 BHK",
      society: "Sunview Enclave",
    },
    {
      id: 2,
      houseNo: "B-203",
      block: "B",
      houseType: "3 BHK",
      society: "Centra Greens",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHouseData, setNewHouseData] = useState({
    houseNo: "",
    block: "",
    houseType: "",
    society: "",
  });

  const [editHouseData, setEditHouseData] = useState(null);
  const [viewHouse, setViewHouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleAddHouse = () => {
    if (newHouseData.houseNo.trim() !== "") {
      const newId =
        houses.length > 0 ? Math.max(...houses.map((h) => h.id)) + 1 : 1;
      setHouses([...houses, { id: newId, ...newHouseData }]);
      setNewHouseData({ houseNo: "", block: "", houseType: "", society: "" });
      setShowAddModal(false);
    }
  };

  const handleDeleteHouse = (id) => {
    const house = houses.find((h) => h.id === id);
    Swal.fire({
      title: `Delete "${house.houseNo}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
    }).then((result) => {
      if (result.isConfirmed) {
        setHouses(houses.filter((h) => h.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${house.houseNo}" deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleUpdateHouse = () => {
    setHouses(
      houses.map((h) => (h.id === editHouseData.id ? { ...editHouseData } : h))
    );
    setEditHouseData(null);
  };

  const handleDownload = () => {
    const headers = "ID,House No,Block,Type,Society\n";
    const csv = houses
      .map(
        (h) =>
          `${h.id},"${h.houseNo}","${h.block}","${h.houseType}","${h.society}"`
      )
      .join("\n");
    const blob = new Blob([headers + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "houses.csv";
    link.click();
  };

  const filteredHouses = houses.filter((h) =>
    h.houseNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedHouses = filteredHouses.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredHouses.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🏠 Add New House</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add House
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by house no..."
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
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>House No</th>
            <th>Block</th>
            <th>Type</th>
            <th>Society</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedHouses.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.houseNo}</td>
              <td>{h.block}</td>
              <td>{h.houseType}</td>
              <td>{h.society}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => setEditHouseData(h)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteHouse(h.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewHouse(h)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedHouses.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No houses found.
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
                  <h5 className="modal-title">Add House</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <select
                    className="form-control mb-2"
                    value={newHouseData.houseType}
                    onChange={(e) =>
                      setNewHouseData({
                        ...newHouseData,
                        houseType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select House Type</option>
                    {houseTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={newHouseData.society}
                    onChange={(e) =>
                      setNewHouseData({
                        ...newHouseData,
                        society: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Society</option>
                    {societyOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-control mb-2"
                    placeholder="House No"
                    value={newHouseData.houseNo}
                    onChange={(e) =>
                      setNewHouseData({
                        ...newHouseData,
                        houseNo: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Block"
                    value={newHouseData.block}
                    onChange={(e) =>
                      setNewHouseData({
                        ...newHouseData,
                        block: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddHouse}>
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
      {editHouseData && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit House</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditHouseData(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    value={editHouseData.houseNo}
                    onChange={(e) =>
                      setEditHouseData({
                        ...editHouseData,
                        houseNo: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={editHouseData.block}
                    onChange={(e) =>
                      setEditHouseData({
                        ...editHouseData,
                        block: e.target.value,
                      })
                    }
                  />
                  <select
                    className="form-control mb-2"
                    value={editHouseData.houseType}
                    onChange={(e) =>
                      setEditHouseData({
                        ...editHouseData,
                        houseType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select House Type</option>
                    {houseTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editHouseData.society}
                    onChange={(e) =>
                      setEditHouseData({
                        ...editHouseData,
                        society: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Society</option>
                    {societyOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditHouseData(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateHouse}
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
      {viewHouse && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">House Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewHouse(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {viewHouse.id}
                  </p>
                  <p>
                    <strong>House No:</strong> {viewHouse.houseNo}
                  </p>
                  <p>
                    <strong>Block:</strong> {viewHouse.block}
                  </p>
                  <p>
                    <strong>Type:</strong> {viewHouse.houseType}
                  </p>
                  <p>
                    <strong>Society:</strong> {viewHouse.society}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewHouse(null)}
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

export default AddHouse;
