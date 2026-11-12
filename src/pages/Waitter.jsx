import { useRef, useState } from "react";
import { CloudUpload, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import WaitterImg from "../assets/images/waitter.jpg";

const emptyForm = {
  accessCode: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  status: "Active",
};

const AllWaitter = [
  {
    id: 1,
    code: "W001",
    name: "Soumen Ghosh",
    image: WaitterImg,
    email: "waiter1@gmail.com",
    phone: "9876543210",
    password: "",
    status: "Active",
    joiningDate: "2026-09-23",
  },
  {
    id: 2,
    code: "W002",
    name: "Rahul Das",
    image: WaitterImg,
    email: "waiter2@gmail.com",
    phone: "9876543211",
    password: "",
    status: "Active",
    joiningDate: "2026-09-23",
  },
  {
    id: 3,
    code: "W003",
    name: "Amit Kumar",
    image: WaitterImg,
    email: "amit@gmail.com",
    phone: "9876543212",
    password: "",
    status: "Active",
    joiningDate: "2026-09-25",
  },
  {
    id: 4,
    code: "W004",
    name: "Suman Roy",
    image: WaitterImg,
    email: "suman@gmail.com",
    phone: "9876543213",
    password: "",
    status: "Inactive",
    joiningDate: "2026-09-28",
  },
  {
    id: 5,
    code: "W005",
    name: "Arjun Singh",
    image: WaitterImg,
    email: "arjun@gmail.com",
    phone: "9876543214",
    password: "",
    status: "Active",
    joiningDate: "2026-10-01",
  },
  {
    id: 6,
    code: "W006",
    name: "Rohit Sharma",
    image: WaitterImg,
    email: "rohit@gmail.com",
    phone: "9876543215",
    password: "",
    status: "Active",
    joiningDate: "2026-10-05",
  },
  {
    id: 7,
    code: "W007",
    name: "Ankit Verma",
    image: WaitterImg,
    email: "ankit@gmail.com",
    phone: "9876543216",
    password: "",
    status: "Inactive",
    joiningDate: "2026-10-10",
  },
  {
    id: 8,
    code: "W008",
    name: "Vikash Yadav",
    image: WaitterImg,
    email: "vikash@gmail.com",
    phone: "9876543217",
    password: "",
    status: "Active",
    joiningDate: "2026-10-15",
  },
  {
    id: 9,
    code: "W009",
    name: "Deepak Mondal",
    image: WaitterImg,
    email: "deepak@gmail.com",
    phone: "9876543218",
    password: "",
    status: "Active",
    joiningDate: "2026-10-20",
  },
  {
    id: 10,
    code: "W010",
    name: "Prakash Dey",
    image: WaitterImg,
    email: "prakash@gmail.com",
    phone: "9876543219",
    password: "",
    status: "Inactive",
    joiningDate: "2026-10-25",
  },
];

function Waitter() {
  const [categories, setCategories] = useState(AllWaitter);
  const [show, setShow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setPreviewImage(null);
    setEditId(null);
    setValidated(false);
    setFormError("");
    setIsDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const handleEdit = (waiter) => {
    setEditId(waiter.id);

    setFormData({
      accessCode: waiter.code,
      name: waiter.name,
      email: waiter.email,
      phone: waiter.phone,
      password: waiter.password || "",
      status: waiter.status,
    });

    setPreviewImage(waiter.image);
    setValidated(false);
    setFormError("");
    setShow(true);
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Please upload PNG, JPG, JPEG or WEBP image.");
      return;
    }

    setFormError("");

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleImageUpload(event.dataTransfer.files[0]);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const accessCode = formData.accessCode.trim();
    const email = formData.email.trim().toLowerCase();

    const duplicateAccessCode = categories.some(
      (item) =>
        item.id !== editId &&
        item.code.toLowerCase() === accessCode.toLowerCase(),
    );

    const duplicateEmail = categories.some(
      (item) => item.id !== editId && item.email.toLowerCase() === email,
    );

    if (duplicateAccessCode) {
      setFormError("This access code is already in use.");
      return;
    }

    if (duplicateEmail) {
      setFormError("This email address is already in use.");
      return;
    }

    const existingWaiter = categories.find((item) => item.id === editId);

    const newWaiter = {
      id: editId || Date.now(),
      code: accessCode,
      name: formData.name.trim(),
      image: previewImage,
      email,
      phone: formData.phone.trim(),
      password: formData.password,
      status: formData.status,
      joiningDate:
        existingWaiter?.joiningDate || new Date().toISOString().slice(0, 10),
    };

    if (editId) {
      setCategories((prev) =>
        prev.map((item) => (item.id === editId ? newWaiter : item)),
      );
    } else {
      setCategories((prev) => [...prev, newWaiter]);
    }

    handleClose();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this waiter?",
    );

    if (confirmDelete) {
      setCategories((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header mb-2">
              <div>
                <h5 className="mb-0">Waiter Management</h5>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <p>All Waiter list</p>
              </div>
            </div>

            <div className="pos-food-wrapper">
              <div className="pos-food-inner add-cate-list">
                <div className="pos-food-grid">
                  <div className="pos-food-item add-items">
                    <div className="text-center">
                      <Plus size={24} />
                    </div>

                    <div className="add-category-content">
                      <h5>Add Waiter</h5>
                      <p>
                        Create and manage your <br /> Waiter
                      </p>
                    </div>

                    <button
                      type="button"
                      className="resto-primary"
                      onClick={handleShow}
                    >
                      Add Waiter
                    </button>
                  </div>

                  {categories.map((waiter) => (
                    <div className="pos-food-item add-food" key={waiter.id}>
                      <div className="pos-food-image waitter">
                        {waiter.image ? (
                          <img src={waiter.image} alt={waiter.name} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <CloudUpload size={30} />
                          </div>
                        )}

                        <div
                          className={`under-category ${
                            waiter.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {waiter.status}
                        </div>
                      </div>

                      <div className="pos-food-details mb-3">
                        <small>{waiter.email}</small>
                        <h6>{waiter.name}</h6>

                        <div className="pos-price">
                          <p className="access-code">{waiter.code}</p>
                          <small className="d-block">
                            {waiter.joiningDate}
                          </small>
                        </div>
                      </div>

                      <div className="pos-food-btn d-flex gap-2">
                        <button
                          type="button"
                          className="action-btn edit"
                          title="Edit Waiter"
                          onClick={() => handleEdit(waiter)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete"
                          title="Delete Waiter"
                          onClick={() => handleDelete(waiter.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Waiter</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Waiter" : "Add Waiter"}
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="waiterName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="waiterEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="waiterPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="waiterStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        className="w-100"
                        value={formData.status}
                        onChange={(event) =>
                          updateField("status", event.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Select>
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
                      handleImageUpload(event.target.files[0])
                    }
                  />

                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Waiter preview"
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
              onClick={handleClose}
            >
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              {editId ? "Update Waiter" : "Save Waiter"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Waitter;
