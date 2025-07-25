import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function SellHouseReport() {
  const [countries, setCountries] = useState([
    { id: 1,societyname:"Sunview Enclave", name: "1 BHK",address:"SouthCity",totalselling:"5" },
    { id: 2,societyname:"Centra Greens", name: "2 BHK",address:"Pakhowal Road",totalselling:"4" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const[Housetype,setHousetype]=useState("");
  const[Address,setAddress]=useState("");
  const[Totalselling,setTotalselling]=useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editCountryId, setEditCountryId] = useState(null);
  const [editCountryName, setEditCountryName] = useState("");
  const [viewCountry, setViewCountry] = useState(null);

  const handleAddCountry = () => {
    if (newCountry.trim() !== "") {
      const newId =
        countries.length > 0
          ? Math.max(...countries.map((c) => c.id)) + 1
          : 1;
      setCountries([...countries, { id: newId, name: newCountry,Housetype:Housetype,Address:Address,Totalselling:Totalselling }]);
      setNewCountry("");
      setShowAddModal(false);
    }
  };

  const handleDeleteCountry = (id) => {
    const country = countries.find((c) => c.id === id);

    Swal.fire({
      title: `Delete "${country.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      iconColor: "#f39c12",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      customClass: {
        popup: "swal2-small-popup",
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom",
      },
      width: "300px",
      padding: "1em",
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setCountries(countries.filter((c) => c.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${country.name}" deleted`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleEditCountry = (country) => {
    setEditCountryId(country.id);
    setEditCountryName(country.name);
  };

  const handleUpdateCountry = () => {
    if (editCountryName.trim() !== "") {
      setCountries(
        countries.map((c) =>
          c.id === editCountryId ? { ...c, name: editCountryName } : c
        )
      );
      setEditCountryId(null);
      setEditCountryName("");
    }
  };

  const handleDownload = () => {
    const csv = countries.map((c) => c.name).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "countries.csv";
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
        <h4 className="mb-0">📃 Selling Report</h4>
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
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Society Name</th>
            <th>House type</th>
            <th>Address</th>
            <th>Total Selling</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCountries.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.societyname}</td>
              <td>{c.name}</td>
              <td>{c.address}</td>
              <td>{c.totalselling}</td>
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
                  <h5 className="modal-title">Add Society</h5>
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
                    placeholder="Society Name"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
                  <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="House Type"
                    value={Housetype}
                    onChange={(e) => setHousetype(e.target.value)}
                  />
                </div>
                  <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    value={Address}
                    onChange={(e) => setAddress (e.target.value)}
                  />
                </div>
                  <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Total Selling"
                    value={Totalselling}
                    onChange={(e) => setTotalselling (e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddCountry}>
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
                  <h5 className="modal-title">Edit society</h5>
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

export default SellHouseReport;