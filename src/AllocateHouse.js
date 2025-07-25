/* eslint-disable no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function AllocateHouse() {
  const [countries, setCountries] = useState([
    {
      id: 1,
      totalmember: "4",
      phoneno: "9876543210",
      email: "sanjay@gmail.com",
      membername: "Sanjay",
      societyname: "Sunview Enclave",
      name: "1 BHK",
      address: "Ludhiana",
    },
    {
      id: 2,
      totalmember: "5",
      phoneno: "6512541547",
      email: "amit@gmail.com",
      membername: "Amit",
      societyname: "Centra Greens",
      name: "2 BHK",
      address: "Ludhiana",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [HouseType, setHouseType] = useState("");
  const [Address, setAddress] = useState("");
  const [Membername, setMembername] = useState("");
  const [Email, setEmail] = useState("");
  const [Phoneno, setPhoneno] = useState("");
  const [Totalmember, setTotalmember] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editCountryId, setEditCountryId] = useState(null);
  const [editCountryName, setEditCountryName] = useState("");
  const [editCountryHouseType, setEditCountryHouseType] = useState("");
  const [editCountryAddress, setEditCountryAddress] = useState("");
  const [editCountryMemberName, setEditCountryMemberName] = useState("");
  const [editCountryEmail, setEditCountryEmail] = useState("");
  const [editCountryPhoneNumber, setEditCountryPhoneNumber] = useState("");
  const [viewCountry, setViewCountry] = useState(null);

  const handleAddCountry = () => {
    if (newCountry.trim() !== "") {
      const newId =
        countries.length > 0 ? Math.max(...countries.map((c) => c.id)) + 1 : 1;
      setCountries([
        ...countries,
        {
          id: newId,
          societyname: newCountry,
          name: HouseType,
          address: Address,
          membername: Membername,
          email: Email,
          phoneno: Phoneno,
          totalmember: Totalmember,
        },
      ]);
      setNewCountry("");
      setShowAddModal(false);
    }
  };

  const handleDeleteCountry = (id) => {
    const country = countries.find((c) => c.id === id);

    Swal.fire({
      title: `Delete "${country.societyname}"?`,
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
          title: `"${country.societyname}" deleted`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleEditCountry = (country) => {
    setEditCountryId(country.id);
    setEditCountryName(country.societyname);
    setEditCountryHouseType(country.name); // 'name' means house type in your data
    setEditCountryAddress(country.address);
    setEditCountryMemberName(country.membername);
    setEditCountryEmail(country.email);
    setEditCountryPhoneNumber(country.phoneno);
  };

  const handleUpdateCountry = () => {
    // Update the entry in the data list based on editCountryId
    const updated = countries.map((item) =>
      item.id === editCountryId
        ? {
            ...item,
            societyname: editCountryName,
            name: editCountryHouseType,
            address: editCountryAddress,
            membername: editCountryMemberName,
            email: editCountryEmail,
            phoneno: editCountryPhoneNumber,
          }
        : item
    );
    setCountries(updated);
    Swal.fire("Updated!", "Allocation details have been updated.", "success");
    setEditCountryId(null);
  };

  const handleDownload = () => {
    const csv = countries
      .map(
        (c) =>
          `${c.id},${c.societyname},${c.name},${c.address},${c.membername},${c.email},${c.phoneno},${c.totalmember}`
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "allocated-houses.csv";
    link.click();
  };

  const filteredCountries = countries.filter((c) =>
    c.societyname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🏠➡️ Allocate House to Member</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Allocate House
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
            <th>Society Name</th>
            <th>House type</th>
            <th>Address</th>
            <th>Member Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Total Member</th>
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
              <td>{c.membername}</td>
              <td>{c.email}</td>
              <td>{c.phoneno}</td>
              <td>{c.totalmember}</td>
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
                  <h5 className="modal-title">Allocate House</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Society Name"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="House Type"
                    value={HouseType}
                    onChange={(e) => setHouseType(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Member Name"
                    value={Membername}
                    onChange={(e) => setMembername(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Address"
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Phone Number"
                    value={Phoneno}
                    onChange={(e) => setPhoneno(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Total Member"
                    value={Totalmember}
                    onChange={(e) => setTotalmember(e.target.value)}
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
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Edit House Allocation</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setEditCountryId(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label>Society Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCountryName}
                      onChange={(e) => setEditCountryName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label>House Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCountryHouseType}
                      onChange={(e) => setEditCountryHouseType(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCountryAddress}
                      onChange={(e) => setEditCountryAddress(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Member Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCountryMemberName}
                      onChange={(e) => setEditCountryMemberName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editCountryEmail}
                      onChange={(e) => setEditCountryEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCountryPhoneNumber}
                      onChange={(e) =>
                        setEditCountryPhoneNumber(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditCountryId(null)}
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
                  <h5 className="modal-title">House Allocation Detail</h5>
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
                    <strong>Society Name:</strong> {viewCountry.societyname}
                  </p>
                  <p>
                    <strong>House Type:</strong> {viewCountry.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {viewCountry.address}
                  </p>
                  <p>
                    <strong>Member Name:</strong> {viewCountry.membername}
                  </p>
                  <p>
                    <strong>Email:</strong> {viewCountry.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {viewCountry.phoneno}
                  </p>
                  <p>
                    <strong>Total Members:</strong> {viewCountry.totalmember}
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
    </div> // <-- closing the main return <div className="container mt-4">
  );
}

export default AllocateHouse;
