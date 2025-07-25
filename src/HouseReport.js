/* eslint-disable no-unused-vars */
import { useState } from "react";

function HouseReport() {
  const [houses] = useState([
    { id: 1, number: "A-101", society: "Sunview Enclave" },
    { id: 2, number: "B-203", society: "Centra Greens" },
    { id: 3, number: "C-305", society: "Ludhiana Heights" },
    { id: 4, number: "D-407", society: "Green Acres" },
    { id: 5, number: "E-509", society: "Pearl Residency" },
  ]);

  const [selectedSociety, setSelectedSociety] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Added missing state
  const [viewClicked, setViewClicked] = useState(true); // Enable view by default
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleDownload = () => {
    const filtered = houses.filter(
      (h) =>
        (!selectedSociety || h.society === selectedSociety) &&
        (!searchTerm ||
          h.number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const csv = filtered
      .map((h) => `${h.id},${h.number},${h.society}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "house-report.csv";
    link.click();
  };

  const filteredHouses = houses.filter(
    (h) =>
      (!selectedSociety || h.society === selectedSociety) &&
      (!searchTerm || h.number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedHouses = filteredHouses.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredHouses.length / pageSize);

  return (
    <div className="container mt-4">
      <h4 className="mb-3"> 📃 House Report</h4>

      {/* Top Controls */}
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

      {/* Table Section */}
      {viewClicked && (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>House Number</th>
                <th>Society</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHouses.map((h) => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td>{h.number}</td>
                  <td>{h.society}</td>
                </tr>
              ))}
              {paginatedHouses.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <nav className="mt-3">
            <ul className="pagination pagination-sm justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default HouseReport;
