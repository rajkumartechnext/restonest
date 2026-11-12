import { useRef, useState } from "react";
import { CloudUpload, Pencil, Plus, Trash2, X } from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import categoryImage from "../assets/images/cate-1.jpg";
import categoryImage2 from "../assets/images/cate-2.jpg";
import categoryImage3 from "../assets/images/cate-3.jpg";

function FoodCategory() {
  const initialCategories = [
    {
      id: 1,
      code: "FOOD655415",
      name: "Starters",
      image: categoryImage,
    },
    {
      id: 2,
      code: "FOOD655416",
      name: "Main Course",
      image: categoryImage2,
    },
    {
      id: 3,
      code: "FOOD655417",
      name: "Chinese Food",
      image: categoryImage3,
    },
    {
      id: 4,
      code: "FOOD655418",
      name: "Indian Cuisine",
      image: categoryImage,
    },
    {
      id: 5,
      code: "FOOD655419",
      name: "Tandoori Specials",
      image: categoryImage2,
    },
    {
      id: 6,
      code: "FOOD655420",
      name: "Biryani",
      image: categoryImage3,
    },
    {
      id: 7,
      code: "FOOD655421",
      name: "Desserts",
      image: categoryImage2,
    },
    {
      id: 8,
      code: "FOOD655422",
      name: "Beverages",
      image: categoryImage3,
    },
    {
      id: 9,
      code: "FOOD655421",
      name: "Desserts",
      image: categoryImage2,
    },
    {
      id: 10,
      code: "FOOD655422",
      name: "Beverages",
      image: categoryImage3,
    },
  ];
  const [categories, setCategories] = useState(initialCategories);
  const [show, setShow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);

  const fileInputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setCategoryName("");
    setPreviewImage(null);
    setEditId(null);
    setValidated(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleShow = () => {
    setCategoryName("");
    setPreviewImage(null);
    setEditId(null);
    setValidated(false);
    setShow(true);
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setCategoryName(category.name);
    setPreviewImage(category.image);
    setValidated(false);
    setShow(true);
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload PNG, JPG, JPEG or WEBP image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const newCategory = {
      id: editId || Date.now(),
      code: editId
        ? categories.find((item) => item.id === editId)?.code
        : `FOOD${Date.now().toString().slice(-6)}`,
      name: categoryName.trim(),
      image: previewImage,
    };

    if (editId) {
      setCategories((prev) =>
        prev.map((item) => (item.id === editId ? newCategory : item)),
      );
    } else {
      setCategories((prev) => [...prev, newCategory]);
    }

    handleClose();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (confirmDelete) {
      setCategories((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header mb-2">
              <div>
                <h5 className="mb-0">Food Categories</h5>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <p>All food category list</p>
              </div>
            </div>

            <div className="pos-food-wrapper ">
              <div className="pos-food-inner add-cate-list">
                <div className="pos-food-grid">
                  <div className="pos-food-item add-items">
                    <div className="text-center">
                      <Plus size={24} />
                    </div>

                    <div className="add-category-content">
                      <h5>Food Category</h5>
                      <p>Create and manage your food categories</p>
                    </div>

                    <button
                      type="button"
                      className="resto-primary"
                      onClick={handleShow}
                    >
                      Add Category
                    </button>
                  </div>

                  {categories.map((category) => (
                    <div className="pos-food-item add-food" key={category.id}>
                      <div className="pos-food-image">
                        {category.image ? (
                          <img src={category.image} alt={category.name} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <CloudUpload size={30} />
                          </div>
                        )}
                      </div>

                      <div className="pos-food-details mb-3">
                        <small>{category.code}</small>
                        <h6>{category.name}</h6>
                      </div>

                      <div className="pos-food-btn d-flex gap-2">
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDelete(category.id)}
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
            <Modal.Title>Category</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Category" : "Add Category"}
                </h5>

                <Form.Group className="mb-3" controlId="categoryName">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter category name.
                  </Form.Control.Feedback>
                </Form.Group>

                <div
                  className={`pos-food-item upload-box ${
                    isDragging ? "drag-active" : ""
                  } ${previewImage ? "has-image" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
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
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />

                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Food category preview"
                        className="upload-preview"
                      />

                      <button
                        type="button"
                        className="upload-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
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
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Plus size={15} /> Upload
                      </button>
                    </>
                  )}
                </div>
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
              {editId ? "Update Category" : "Save Category"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default FoodCategory;
