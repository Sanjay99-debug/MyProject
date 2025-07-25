import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function MemberReport() {
  const [selectedSociety, setSelectedSociety] = useState("");
  const [viewClicked, setViewClicked] = useState(false);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Aryan Kc",
      phone: "9876543210",
      email: "aryan@gmail.com",
      society: "Centra Greens",
    },
    {
      id: 2,
      name: "Sanju RAna",
      phone: "9898989898",
      email: "sanju@gmail.com",
      society: "Sunview Enclave",
    },
    {
      id: 3,
      name: "Amit Singh",
      phone: "9812345678",
      email: "amit@gmail.com",
      society: "Hampton Homes",
    },
  ]);

  const handleView = () => {
    if (!selectedSociety) {
      Swal.fire("Error", "Please select a society", "warning");
      return;
    }
    setViewClicked(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This member will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = members.filter((m) => m.id !== id);
        setMembers(updated);
        Swal.fire("Deleted!", "Member has been deleted.", "success");
      }
    });
  };

  const filteredMembers = members.filter((m) => m.society === selectedSociety);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">👥 Member Report</h4>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select
            className="form-select form-select-sm"
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
          >
            <option value="">-- Select Society --</option>
            <option value="Centra Greens">Centra Greens</option>
            <option value="Sunview Enclave">Sunview Enclave</option>
            <option value="Hampton Homes">Hampton Homes</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary btn-sm" onClick={handleView}>
            View
          </button>
        </div>
      </div>

      {viewClicked && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Society</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{m.email}</td>
                  <td>{m.society}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(m.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MemberReport;
