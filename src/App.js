import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Society from "./Society";
import AddHouse from "./AddHouse";
import HouseReport from "./HouseReport";
import AllocateHouse from "./AllocateHouse";
import MemberReport from "./MemberReport";
import SellHouseReport from "./SellHouseReport";
import RentHouseReport from "./RentHouseReport";
import Complain from "./Complain";
import Role from "./superAdmin/Role";
import User from "./superAdmin/User";
import UserRole from "./superAdmin/UserRole";

function Sidebar() {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div className="bg-dark text-light vh-100" style={{ width: "250px" }}>
      <div className="p-auto">
        <ul className="nav nav-pills flex-column gap-2">
          {role === "Admin" && (
            <>
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/dashboard" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  <span className="badge bg-primary ms-auto">New</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/society"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/society" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-building me-2"></i> Add Society
                  <span className="badge bg-success ms-auto">Hot</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/house"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/house" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Add House
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/house-report"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/house-report"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> House Report
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/allocate-house"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/allocate-house"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Allocate House
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
            </>
          )}
          {role === "Owner" && (
            <>
              <li className="nav-item">
                <Link
                  to="/member-report"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/member-report"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Member Report
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/complain"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/complain" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Complain
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/sell-house"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/sell-house"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Sell House Report
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/rent-house"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/rent-house"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Rent House Report
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
            </>
          )}
          {role === "Super Admin" && (
            <>
              <li className="nav-item">
                <Link
                  to="/role"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/role" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> Role
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/user"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/user" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> User
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/user-role"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/user-role" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i> User Role
                  <span className="badge bg-warning text-dark ms-auto">
                    Updated
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/society" element={<Society />} />
              <Route path="/house" element={<AddHouse />} />
              <Route path="/house-report" element={<HouseReport />} />
              <Route path="/allocate-house" element={<AllocateHouse />} />
              <Route path="/member-report" element={<MemberReport />} />
              <Route path="/sell-house" element={<SellHouseReport />} />
              <Route path="/rent-house" element={<RentHouseReport />} />
              <Route path="/complain" element={<Complain />} />
              <Route path="/role" element={<Role />} />
              <Route path="/user" element={<User />} />
              <Route path="/user-role" element={<UserRole />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
