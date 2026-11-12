import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import {
  Armchair,
  List,
  Pencil,
  Plus,
  QrCode,
  TicketCheck,
  Trash2,
  PrinterCheck,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "../components/Header";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

const emptyForm = {
  tableNo: "",
  tableName: "",
  capacity: "",
  tableType: "Regular",
  floor: "Ground Floor",
  status: "Available",
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

function Table() {
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    const table = window.jQuery(tableElement);

    const dataTable = table.DataTable({
      retrieve: true,
      scrollX: true,
      scrollY: "450px",
      scrollCollapse: true,
      fixedColumns: {
        start: 2,
        end: 1,
      },
      searching: false,
      paging: false,
      lengthChange: false,
      info: false,
      ordering: true,
      autoWidth: false,
      columnDefs: [{ targets: [0, 1, 6], orderable: false }],
    });

    table.on("click.tableActions", "button.action-btn.edit", function () {
      const row = this.closest("tr");
      const cells = row.cells;
      setEditingRow(row);
      setFormData({
        tableNo: cells[0].textContent.trim(),
        tableName: cells[1].textContent.trim(),
        capacity: cells[2].textContent.match(/\d+/)?.[0] || "",
        tableType: cells[3].textContent.trim(),
        floor: cells[4].textContent.trim(),
        status: cells[5].textContent.trim(),
      });
      setFormError("");
      setShowForm(true);
    });

    table.on("click.tableActions", "button.action-btn.delete", function () {
      setDeletingRow(this.closest("tr"));
      setShowDelete(true);
    });

    return () => {
      table.off(".tableActions");
      if (window.jQuery.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }
    };
  }, []);

  const handleAddTable = () => {
    setEditingRow(null);
    setFormData(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const dataTable = window.jQuery(tableRef.current).DataTable();
    const tableNo = formData.tableNo.trim();
    const duplicateTableNo = dataTable
      .rows()
      .nodes()
      .toArray()
      .some(
        (row) =>
          row !== editingRow &&
          row.cells[0].textContent.trim().toLowerCase() ===
            tableNo.toLowerCase(),
      );

    if (duplicateTableNo) {
      setFormError("This table number is already in use.");
      return;
    }

    const safe = (value) => escapeHtml(value.trim());
    const statusClass = {
      Available: "success",
      Reserved: "warning",
      OnDine: "denger",
    }[formData.status];
    const rowData = [
      safe(tableNo),
      `<b>${safe(formData.tableName)}</b>`,
      `${safe(formData.capacity)} Persons`,
      safe(formData.tableType),
      safe(formData.floor),
      `<span class="stock-status ${statusClass}">${safe(formData.status)}</span>`,
      `<div class="table-actions">
        <button class="action-btn other" aria-label="Show table QR code">${renderToStaticMarkup(<QrCode size={15} />)}</button>
        <button class="action-btn edit" aria-label="Edit table">${renderToStaticMarkup(<Pencil size={15} />)}</button>
        <button class="action-btn delete" aria-label="Delete table">${renderToStaticMarkup(<Trash2 size={15} />)}</button>
      </div>`,
    ];

    if (editingRow) {
      dataTable.row(editingRow).data(rowData).draw(false);
    } else {
      dataTable.row.add(rowData).draw(false);
    }

    setShowForm(false);
    setFormData(emptyForm);
  };

  const handleDeleteTable = () => {
    if (deletingRow) {
      window
        .jQuery(tableRef.current)
        .DataTable()
        .row(deletingRow)
        .remove()
        .draw(false);
    }
    setShowDelete(false);
    setDeletingRow(null);
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5>Manage Tables</h5>
                <p>Manage your restaurant floor and table availability</p>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <Link className="action-btn other" as={Link} to="/generate-qr">
                  <QrCode size={15} />
                </Link>

                <button className="resto-primary">
                  <TicketCheck size={16} />
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
              </div>
            </div>

            <div className="table-wrapper">
              <table
                ref={tableRef}
                className="display nowrap restaurant-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Table No.</th>
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Table Type</th>
                    <th>Floor</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>T-01</td>
                    <td>
                      <b>Table 01</b>
                    </td>
                    <td>4 Persons</td>
                    <td>Regular</td>
                    <td>Ground Floor</td>
                    <td>
                      <span className="stock-status success">Available</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="action-btn other">
                          <PrinterCheck size={15} />
                        </button>
                        <button className="action-btn edit">
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>T-02</td>
                    <td>
                      <b>Table 02</b>
                    </td>
                    <td>2 Persons</td>
                    <td>Regular</td>
                    <td>Ground Floor</td>
                    <td>
                      <span className="stock-status warning">Reserved</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="action-btn other">
                          <PrinterCheck size={15} />
                        </button>
                        <button className="action-btn edit">
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>T-03</td>
                    <td>
                      <b>Table 03</b>
                    </td>
                    <td>6 Persons</td>
                    <td>Family</td>
                    <td>Ground Floor</td>
                    <td>
                      <span className="stock-status denger">On Dine</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="action-btn other">
                          <PrinterCheck size={15} />
                        </button>
                        <button className="action-btn edit">
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>T-04</td>
                    <td>
                      <b>Table 04</b>
                    </td>
                    <td>4 Persons</td>
                    <td>Regular</td>
                    <td>Ground Floor</td>
                    <td>
                      <span className="stock-status success">Available</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="action-btn other">
                          <PrinterCheck size={15} />
                        </button>
                        <button className="action-btn edit">
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>

      <Modal
        size="lg"
        show={showForm}
        onHide={() => setShowForm(false)}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closebutton>
            <Modal.Title>{editingRow ? "Edit Table" : "Add Table"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="tableNumber">
                  <Form.Label>Table Number</Form.Label>
                  <Form.Control
                    required
                    value={formData.tableNo}
                    placeholder="e.g. T-05"
                    onChange={(event) =>
                      setFormData({ ...formData, tableNo: event.target.value })
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
                    placeholder="e.g. Table 05"
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
                    placeholder="Number of persons"
                    onChange={(event) =>
                      setFormData({ ...formData, capacity: event.target.value })
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
                      setFormData({ ...formData, floor: event.target.value })
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
                      setFormData({ ...formData, status: event.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>On Dine</option>
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
            <button className="resto-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              {editingRow ? "Save Changes" : "Add Table"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closebutton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this table? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDelete(false)}
          >
            Cancel
          </button>
          <button className="resto-cancel" onClick={handleDeleteTable}>
            Delete Table
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Table;
