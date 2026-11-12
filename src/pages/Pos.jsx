import React, { useState } from "react";
import Header from "../components/Header";
import { Container, Modal, Form, Row, Col } from "react-bootstrap";
import {
  TicketCheck,
  Armchair,
  QrCode,
  Plus,
  Pencil,
  Eye,
  PrinterCheck,
  List,
  X,
  Redo2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Select from "react-select";

const initialTables = [
  {
    id: 1,
    tableNo: "T-01",
    tableName: "Table #1",
    capacity: 6,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "available",
    top: ["available", "available"],
    left: ["available"],
    right: ["available"],
    bottom: ["available", "available"],
  },
  {
    id: 2,
    tableNo: "T-02",
    tableName: "Table #2",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "dining",
    top: ["available"],
    left: ["dining"],
    right: ["available"],
    bottom: ["dining"],
  },
  {
    id: 3,
    tableNo: "T-03",
    tableName: "Table #3",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "available",
    top: ["available"],
    left: ["available"],
    right: ["available"],
    bottom: ["available"],
  },
  {
    id: 4,
    tableNo: "T-04",
    tableName: "Table #4",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "dining",
    top: ["dining"],
    left: ["dining"],
    right: ["available"],
    bottom: ["dining"],
  },
  {
    id: 5,
    tableNo: "T-05",
    tableName: "Table #5",
    capacity: 5,
    tableType: "Family",
    floor: "Ground Floor",
    status: "reserved",
    top: ["reserved", "reserved"],
    left: ["reserved"],
    right: ["reserved"],
    bottom: ["reserved"],
  },
  {
    id: 6,
    tableNo: "T-06",
    tableName: "Table #6",
    capacity: 7,
    tableType: "Family",
    floor: "Ground Floor",
    status: "reserved",
    top: ["reserved", "reserved", "reserved"],
    left: ["reserved"],
    right: ["reserved"],
    bottom: ["reserved", "reserved", "reserved"],
  },
  {
    id: 7,
    tableNo: "T-07",
    tableName: "Table #7",
    capacity: 10,
    tableType: "Family",
    floor: "Ground Floor",
    status: "available",
    top: ["available", "available", "available", "available"],
    left: ["available"],
    right: ["available"],
    bottom: ["available", "available", "available", "available"],
  },
  {
    id: 8,
    tableNo: "T-08",
    tableName: "Table #8",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "dining",
    top: ["dining"],
    left: ["dining"],
    right: ["available"],
    bottom: ["available"],
  },
  {
    id: 9,
    tableNo: "T-09",
    tableName: "Table #9",
    capacity: 5,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "dining",
    top: ["dining", "dining"],
    left: ["available"],
    right: ["available"],
    bottom: ["dining"],
  },
  {
    id: 10,
    tableNo: "T-10",
    tableName: "Table #10",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "dining",
    top: ["dining"],
    left: ["dining"],
    right: ["available"],
    bottom: ["dining"],
  },
  {
    id: 11,
    tableNo: "T-11",
    tableName: "Table #11",
    capacity: 4,
    tableType: "Regular",
    floor: "Ground Floor",
    status: "available",
    top: ["available"],
    left: ["available"],
    right: ["available"],
    bottom: ["available"],
  },
  {
    id: 12,
    tableNo: "T-12",
    tableName: "Table #12",
    capacity: 8,
    tableType: "Family",
    floor: "Ground Floor",
    status: "available",
    top: ["available", "available", "available"],
    left: ["available"],
    right: ["available"],
    bottom: ["available", "available", "available"],
  },
];

const emptyForm = {
  tableNo: "",
  tableName: "",
  capacity: "",
  tableType: "Regular",
  floor: "Ground Floor",
  status: "Available",
};

const emptyReservationForm = {
  customerName: "",
  phone: "",
  date: "",
  time: "",
  guests: "",
  tableIds: [],
  specialRequest: "",
};

function Pos() {
  const [tables, setTables] = useState(initialTables);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const [showReservation, setShowReservation] = useState(false);
  const [reservationData, setReservationData] = useState(emptyReservationForm);
  const tableOptions = tables
    .filter((table) => table.status === "available")
    .map((table) => ({
      value: table.id,
      label: `${table.tableNo} - ${table.tableName}`,
    }));
  const selectedTableOptions = tableOptions.filter((option) =>
    reservationData.tableIds.includes(option.value),
  );

  const renderChairs = (chairs, position) => (
    <div className={`chair-group ${position}`}>
      {chairs.map((status, index) => (
        <span className={`chair-seat ${status}`} key={index}>
          <Armchair size={20} strokeWidth={2.2} />
        </span>
      ))}
    </div>
  );

  const handleAddTable = () => {
    setEditingRow(null);
    setFormData({
      ...emptyForm,
      tableNo: `T-${String(Math.max(...tables.map((t) => t.id), 0) + 1).padStart(2, "0")}`,
      tableName: `Table #${Math.max(...tables.map((t) => t.id), 0) + 1}`,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.tableNo.trim() ||
      !formData.tableName.trim() ||
      !formData.capacity ||
      Number(formData.capacity) < 1
    ) {
      setFormError("Please fill all required fields correctly.");
      return;
    }

    const status =
      formData.status.toLowerCase() === "occupied"
        ? "dining"
        : formData.status.toLowerCase();

    const capacity = Number(formData.capacity);
    const topCount = Math.ceil(capacity / 2);
    const bottomCount = capacity - topCount;

    const newTable = {
      id: editingRow
        ? editingRow.id
        : Math.max(...tables.map((t) => t.id), 0) + 1,
      ...formData,
      capacity,
      status,
      top: Array(topCount).fill(status),
      left: [],
      right: [],
      bottom: Array(bottomCount).fill(status),
    };

    if (editingRow) {
      setTables((prev) =>
        prev.map((table) => (table.id === editingRow.id ? newTable : table)),
      );
    } else {
      setTables((prev) => [...prev, newTable]);
    }

    setShowForm(false);
    setEditingRow(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const handleReservationSubmit = (event) => {
    event.preventDefault();
    setShowReservation(false);
    setReservationData(emptyReservationForm);
  };

  const availableCount = tables.filter(
    (table) => table.status === "available",
  ).length;
  const reservedCount = tables.filter(
    (table) => table.status === "reserved",
  ).length;
  const diningCount = tables.filter(
    (table) => table.status === "dining",
  ).length;

  return (
    <>
      <Header />

      <main className="restonest-dashboard pos-page">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5>Manage Tables</h5>
                <p>Manage your restaurant floor and table availability</p>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <Link type="button" className="resto-cancel" to="/under-pos">
                  <Redo2 size={15} /> Take Away
                </Link>

                <button
                  className="resto-primary"
                  onClick={() => setShowReservation(true)}
                >
                  <TicketCheck size={15} />
                  Reservation
                </button>

                <button className="btn-secondary" onClick={handleAddTable}>
                  <Plus size={15} /> Add Table
                </button>

                <Link to="/pos" className="action-btn other">
                  <Armchair size={15} />
                </Link>

                <Link to="/table" className="action-btn other">
                  <List size={15} />
                </Link>

                <Link className="action-btn other" to="/generate-qr">
                  <QrCode size={15} />
                </Link>
              </div>
            </div>

            <div className="pos-floor-wrapper">
              <div className="pos-floor-legend">
                <div className="legend-item">
                  <span className="legend-dot available"></span>
                  <span>Available</span>
                  <strong>{availableCount}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot reserved"></span>
                  <span>Reserved</span>
                  <strong>{reservedCount}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot dining"></span>
                  <span>On Dine</span>
                  <strong>{diningCount}</strong>
                </div>

                <div className="floor">
                  <h4>1st Floor</h4>
                </div>
              </div>

              <div className="pos-floor-plan">
                {tables.map((table) => (
                  <div className="pos-table-item" key={table.id}>
                    <div className="pos-table-layout">
                      {renderChairs(table.top, "chairs-top")}
                      {renderChairs(table.left, "chairs-left")}

                      <div className={`pos-table-card ${table.status}`}>
                        <span className="table-name">{table.tableName}</span>

                        <div className="table-under">
                          <button type="button" className="action-btn other">
                            <PrinterCheck size={15} />
                          </button>

                          <Link to="/under-pos" className="action-btn view">
                            <Eye size={15} />
                          </Link>
                        </div>
                      </div>

                      {renderChairs(table.right, "chairs-right")}
                      {renderChairs(table.bottom, "chairs-bottom")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pos-floor-wrapper">
              <div className="pos-floor-legend">
                <div className="legend-item">
                  <span className="legend-dot available"></span>
                  <span>Available</span>
                  <strong>{availableCount}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot reserved"></span>
                  <span>Reserved</span>
                  <strong>{reservedCount}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot dining"></span>
                  <span>On Dine</span>
                  <strong>{diningCount}</strong>
                </div>

                <div className="floor">
                  <h4>1st Floor</h4>
                </div>
              </div>

              <div className="pos-floor-plan">
                {tables.map((table) => (
                  <div className="pos-table-item" key={table.id}>
                    <div className="pos-table-layout">
                      {renderChairs(table.top, "chairs-top")}
                      {renderChairs(table.left, "chairs-left")}

                      <div className={`pos-table-card ${table.status}`}>
                        <span className="table-name">{table.tableName}</span>

                        <div className="table-under">
                          <button type="button" className="action-btn other">
                            <PrinterCheck size={15} />
                          </button>

                          <Link to="/under-pos" className="action-btn view">
                            <Eye size={15} />
                          </Link>
                        </div>
                      </div>

                      {renderChairs(table.right, "chairs-right")}
                      {renderChairs(table.bottom, "chairs-bottom")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pos-floor-footer">
              <span>
                Total Tables: <strong>{tables.length}</strong>
              </span>

              <span>
                Total Seating Capacity:{" "}
                <strong>
                  {tables.reduce((total, table) => total + table.capacity, 0)}
                </strong>
              </span>
            </div>
          </div>
        </Container>

        <Modal
          size="lg"
          show={showForm}
          onHide={() => setShowForm(false)}
          centered
          dialogClassName="billing-modal-right"
        >
          <Form onSubmit={handleFormSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingRow ? "Edit Table" : "Add Table"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableNumber">
                    <Form.Label>Table Number</Form.Label>
                    <Form.Control
                      required
                      value={formData.tableNo}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          tableNo: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableName">
                    <Form.Label>Table Name</Form.Label>
                    <Form.Control
                      required
                      value={formData.tableName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          tableName: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableCapacity">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          capacity: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableType">
                    <Form.Label>Table Type</Form.Label>
                    <Form.Select
                      value={formData.tableType}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          tableType: event.target.value,
                        })
                      }
                    >
                      <option>Regular</option>
                      <option>Family</option>
                      <option>VIP</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableFloor">
                    <Form.Label>Floor</Form.Label>
                    <Form.Select
                      value={formData.floor}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          floor: event.target.value,
                        })
                      }
                    >
                      <option>Ground Floor</option>
                      <option>First Floor</option>
                      <option>Second Floor</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="tableStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          status: event.target.value,
                        })
                      }
                    >
                      <option>Available</option>
                      <option>Occupied</option>
                      <option>Reserved</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {formError && (
                <div className="text-danger mt-2" role="alert">
                  {formError}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="resto-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="resto-primary" type="submit">
                {editingRow ? "Save Changes" : "Add Table"}
              </button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal
          size="lg"
          show={showReservation}
          onHide={() => setShowReservation(false)}
          centered
          dialogClassName="billing-modal-right"
        >
          <Form onSubmit={handleReservationSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>New Reservation</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationCustomer">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={reservationData.customerName}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          customerName: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      value={reservationData.phone}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          phone: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3" controlId="reservationTable">
                    <div className="multi-select-wrapper">
                      <label className="form-label">Select Table</label>

                      <Select
                        inputId="reservationTable"
                        isMulti
                        options={tableOptions}
                        value={selectedTableOptions}
                        onChange={(value) =>
                          setReservationData({
                            ...reservationData,
                            tableIds: (value || []).map(
                              (option) => option.value,
                            ),
                          })
                        }
                        placeholder="Select tables..."
                        closeMenuOnSelect={false}
                        isSearchable
                        isDisabled={tableOptions.length === 0}
                        classNamePrefix="restonest-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationDate">
                    <Form.Label>Reservation Date</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={reservationData.date}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          date: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationGuests">
                    <Form.Label>Number of Guests</Form.Label>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Control
                        required
                        type="number"
                        min="1"
                        value={reservationData.guests}
                        onChange={(event) =>
                          setReservationData({
                            ...reservationData,
                            guests: event.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="resto-primary"
                        aria-label="Increase guest count"
                        onClick={() =>
                          setReservationData((current) => ({
                            ...current,
                            guests: String(
                              Math.max(0, Number(current.guests) || 0) + 1,
                            ),
                          }))
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationTime">
                    <Form.Label>Reservation From Time</Form.Label>
                    <Form.Control
                      required
                      type="time"
                      value={reservationData.time}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          time: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="reservationTime">
                    <Form.Label>Reservation To Time</Form.Label>
                    <Form.Control
                      required
                      type="time"
                      value={reservationData.time}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          time: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group
                    className="mb-3"
                    controlId="reservationSpecialRequest"
                  >
                    <Form.Label>Special Request</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter any special request..."
                      value={reservationData.specialRequest}
                      onChange={(event) =>
                        setReservationData({
                          ...reservationData,
                          specialRequest: event.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="resto-cancel"
                onClick={() => setShowReservation(false)}
              >
                Cancel
              </button>

              <button className="resto-primary" type="submit">
                Confirm Reservation
              </button>
            </Modal.Footer>
          </Form>
        </Modal>
      </main>
    </>
  );
}

export default Pos;
