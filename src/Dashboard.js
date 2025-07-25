import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaBuilding, FaUsers, FaHome, FaCheckCircle } from "react-icons/fa";

function Dashboard() {
  // Example stats – you can fetch from API or pass as props later
  const stats = {
    totalSocieties: 5,
    totalMembers: 45,
    totalHouses: 60,
    totalAllocated: 38,
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  };

  const iconStyle = {
    fontSize: "2rem",
    color: "#0d6efd",
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-danger mt-3 ">😊 Welcome</h2>
      <h4 className="mb-4 ">📊 Society Management Dashboard</h4>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card style={cardStyle} className="p-3 text-center">
            <FaBuilding style={iconStyle} />
            <h6 className="mt-2">Total Societies</h6>
            <h5>{stats.totalSocieties}</h5>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card style={cardStyle} className="p-3 text-center">
            <FaUsers style={{ ...iconStyle, color: "#198754" }} />
            <h6 className="mt-2">Total Members</h6>
            <h5>{stats.totalMembers}</h5>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card style={cardStyle} className="p-3 text-center">
            <FaHome style={{ ...iconStyle, color: "#ffc107" }} />
            <h6 className="mt-2">Total Houses</h6>
            <h5>{stats.totalHouses}</h5>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card style={cardStyle} className="p-3 text-center">
            <FaCheckCircle style={{ ...iconStyle, color: "#dc3545" }} />
            <h6 className="mt-2">Houses Allocated</h6>
            <h5>{stats.totalAllocated}</h5>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
