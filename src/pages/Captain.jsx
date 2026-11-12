import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

function Captain() {
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [nextId, setNextId] = useState(2);

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    const $ = window.jQuery;

    if (!$ || !tableElement) return;

    const table = $(tableElement);

    const dataTable = table.DataTable({
      retrieve: true,
      scrollX: true,
      scrollCollapse: true,
      searching: true,
      paging: false,
      lengthChange: false,
      info: false,
      ordering: true,
      autoWidth: false,
      dom: "t",
    });

    dataTableRef.current = dataTable;

    table.on("click.tableActions", "button.action-btn.edit", function () {
      const row = this.closest("tr");
      const rowApi = dataTable.row(row);
      const rowIndex = rowApi.index();

      if (rowIndex === undefined) return;

      const cells = row.cells;

      setEditingRow(rowIndex);
      setEditId(cells[0].textContent.trim());

      setFormData({
        name: cells[1].textContent.trim(),
        email: cells[2].textContent.trim(),
        phone: cells[3].textContent.trim(),
        password: "",
        confirmPassword: "",
      });

      setFormError("");
      setShowForm(true);
    });

    table.on("click.tableActions", "button.action-btn.delete", function () {
      const row = this.closest("tr");

      if (window.confirm("Are you sure you want to delete this captain?")) {
        dataTable.row(row).remove().draw(false);
      }
    });

    return () => {
      table.off(".tableActions");

      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }

      dataTableRef.current = null;
    };
  }, []);

  const handleAddCompany = () => {
    setEditingRow(null);
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRow(null);
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSearch = (e) => {
    if (dataTableRef.current) {
      dataTableRef.current.search(e.target.value).draw();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    if (editingRow === null && !formData.password) {
      setFormError("Please enter a password.");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError("Password and confirm password do not match.");
      return;
    }

    const dataTable = dataTableRef.current;

    if (!dataTable) return;

    const rowData = [
      editingRow !== null ? editId : String(nextId).padStart(2, "0"),
      `<b>${escapeHtml(formData.name.trim())}</b>`,
      escapeHtml(formData.email.trim()),
      escapeHtml(formData.phone.trim()),
      editingRow !== null
        ? dataTable.row(editingRow).data()[4]
        : "0 permissions",
      editingRow !== null
        ? dataTable.row(editingRow).data()[5]
        : new Date().toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
      `<div class="table-actions">
        <button class="action-btn edit" aria-label="Edit captain">
          <i></i>
        </button>
        <button class="action-btn delete" aria-label="Delete captain">
          <i></i>
        </button>
      </div>`,
    ];

    if (editingRow !== null) {
      dataTable.row(editingRow).data(rowData).draw(false);
    } else {
      dataTable.row.add(rowData).draw(false);
      setNextId((prev) => prev + 1);
    }

    handleCloseForm();
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5>Company Directory</h5>
                <p>All Company list</p>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <div className="search-wrapper mt-0">
                  <Form.Group>
                    <Form.Control
                      placeholder="Search "
                      onChange={handleSearch}
                    />
                    <Search size={18} />
                  </Form.Group>
                </div>

                <button className="btn-secondary" onClick={handleAddCompany}>
                  <Plus size={15} /> Add New Captain
                </button>
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
                    <th>ID.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Permissions</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>01</td>
                    <td>KYS</td>
                    <td>abc@gmail.com</td>
                    <td>9999999999</td>
                    <td>94 permissions</td>
                    <td>2026-10-08 18:34</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn edit"
                          aria-label="Edit company"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="action-btn delete"
                          aria-label="Delete company"
                        >
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
        onHide={handleCloseForm}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingRow !== null ? "Edit Captain" : "Add Captain"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Captain" : "Add Captain"}
                </h5>

                {formError && (
                  <div className="text-danger mb-3" role="alert">
                    {formError}
                  </div>
                )}

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="captainName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter captain name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="captainEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="captainPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="captainPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        required={editingRow === null}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={
                          editingRow !== null
                            ? "Leave blank to keep current password"
                            : "Enter password"
                        }
                        autoComplete="new-password"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId="captainConfirmPassword"
                    >
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        required={editingRow === null || !!formData.password}
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="resto-cancel"
              onClick={handleCloseForm}
            >
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              {editingRow !== null ? "Save Changes" : "Add Captain"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Captain;
