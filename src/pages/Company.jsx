import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import { Pencil, Plus, Trash2, CloudUpload, X } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "../components/Header";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import categoryImage from "../assets/images/cate-1.jpg";

const emptyForm = {
  companyName: "",
  gstNumber: "",
  phone: "",
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

function Company() {
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);

  const [previewImage, setPreviewImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const tableRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    const $ = window.jQuery;

    if (!$ || !tableElement) return;

    const table = $(tableElement);

    const dataTable = table.DataTable({
      retrieve: true,
      scrollX: true,
      scrollY: "450px",
      scrollCollapse: true,
      fixedColumns: {
        start: 1,
        end: 1,
      },
      searching: false,
      paging: false,
      lengthChange: false,
      info: false,
      ordering: true,
      autoWidth: false,
      columnDefs: [{ targets: [0, 4], orderable: false }],
    });

    table.on("click.tableActions", "button.action-btn.edit", function () {
      const row = this.closest("tr");
      const cells = row.cells;

      setEditingRow(row);
      setEditId(cells[0].textContent.trim() || null);

      setFormData({
        companyName: cells[1].querySelector("b")?.textContent.trim() || "",
        gstNumber: cells[2].textContent.trim(),
        phone: cells[3].textContent.trim(),
      });

      setPreviewImage(cells[1].querySelector("img")?.getAttribute("src") || "");

      setFormError("");
      setShowForm(true);
    });

    table.on("click.tableActions", "button.action-btn.delete", function () {
      setDeletingRow(this.closest("tr"));
      setShowDelete(true);
    });

    return () => {
      table.off(".tableActions");

      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }
    };
  }, []);

  const handleAddCompany = () => {
    setEditingRow(null);
    setEditId(null);
    setFormData(emptyForm);
    setPreviewImage("");
    setFormError("");
    setShowForm(true);
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Please upload a PNG, JPG, JPEG or WEBP image.");
      return;
    }

    setFormError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const dataTable = window.jQuery(tableRef.current).DataTable();

    const companyName = formData.companyName.trim();
    const gstNumber = formData.gstNumber.trim();
    const phone = formData.phone.trim();

    if (!companyName || !gstNumber || !phone) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const duplicateGST = dataTable
      .rows()
      .nodes()
      .toArray()
      .some(
        (row) =>
          row !== editingRow &&
          row.cells[2].textContent.trim().toLowerCase() ===
            gstNumber.toLowerCase(),
      );

    if (duplicateGST) {
      setFormError("This GST number is already in use.");
      return;
    }

    const safe = (value) => escapeHtml(value);

    const imageHTML = previewImage
      ? `<img src="${safe(previewImage)}" alt="" />`
      : "";

    const rowData = [
      editingRow
        ? editingRow.cells[0].textContent.trim()
        : `COM${Date.now().toString().slice(-6)}`,
      `<div class="company">${imageHTML}<b>${safe(companyName)}</b></div>`,
      safe(gstNumber),
      safe(phone),
      `<div class="table-actions">
        <button class="action-btn edit" aria-label="Edit company">
          ${renderToStaticMarkup(<Pencil size={15} />)}
        </button>
        <button class="action-btn delete" aria-label="Delete company">
          ${renderToStaticMarkup(<Trash2 size={15} />)}
        </button>
      </div>`,
    ];

    if (editingRow) {
      dataTable.row(editingRow).data(rowData).draw(false);
    } else {
      dataTable.row.add(rowData).draw(false);
    }

    setShowForm(false);
    setFormData(emptyForm);
    setPreviewImage("");
    setEditingRow(null);
    setEditId(null);
    setFormError("");
  };

  const handleDeleteCompany = () => {
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

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setPreviewImage("");
    setEditingRow(null);
    setEditId(null);
    setFormError("");
    setIsDragging(false);
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
                <button className="btn-secondary" onClick={handleAddCompany}>
                  <Plus size={15} /> Add Company
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
                    <th>GST Number</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>T-01</td>
                    <td>
                      <div className="company">
                        <img src={categoryImage} alt="" />
                        <b>Petuk Maharaj</b>
                      </div>
                    </td>
                    <td>COM455</td>
                    <td>6865475125</td>
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
            <Modal.Title>{editingRow ? " Company" : " Company"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Company" : "Add Company"}
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="companyName">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        required
                        value={formData.companyName}
                        placeholder="e.g. Petuk Maharaj"
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            companyName: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="gstNumber">
                      <Form.Label>GST Number</Form.Label>
                      <Form.Control
                        required
                        value={formData.gstNumber}
                        placeholder="Enter GST number"
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            gstNumber: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="companyPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        value={formData.phone}
                        placeholder="Enter phone number"
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            phone: event.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div
                  className={`pos-food-item upload-box ${
                    isDragging ? "drag-active" : ""
                  } ${previewImage ? "has-image" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!previewImage) fileInputRef.current?.click();
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                    hidden
                    onChange={(event) =>
                      handleImageUpload(event.target.files?.[0])
                    }
                  />

                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Company preview"
                        className="upload-preview"
                      />

                      <button
                        type="button"
                        className="upload-remove"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Plus size={15} /> Change Image
                      </button>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={30} />
                      <h5>Upload Image</h5>
                      <small>Drag and drop image here</small>
                      <small>PNG, JPG, JPEG, WEBP</small>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Plus size={15} /> Upload
                      </button>
                    </>
                  )}
                </div>

                {formError && (
                  <div className="text-danger mt-2" role="alert">
                    {formError}
                  </div>
                )}
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
              {editingRow ? "Save Changes" : "Add Company"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          setDeletingRow(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this company? This action cannot be
          undone.
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowDelete(false);
              setDeletingRow(null);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="resto-cancel"
            onClick={handleDeleteCompany}
          >
            Delete Company
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Company;
