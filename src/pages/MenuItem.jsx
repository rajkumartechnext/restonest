import { useRef, useState } from "react";
import {
  CloudUpload,
  CookingPot,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import categoryImage from "../assets/images/cate-1.jpg";
import categoryImage2 from "../assets/images/cate-2.jpg";
import categoryImage3 from "../assets/images/cate-3.jpg";

function MenuItem() {
  const options = [
    { value: "Table 1", label: "Table 1" },
    { value: "Table 2", label: "Table 2" },
    { value: "Table 3", label: "Table 3" },
    { value: "Table 4", label: "Table 4" },
    { value: "Table 5", label: "Table 5" },
  ];

  const unitOptions = [
    { value: "Kg", label: "Kg" },
    { value: "Gram", label: "Gram" },
    { value: "Litre", label: "Litre" },
    { value: "ML", label: "ML" },
    { value: "Piece", label: "Piece" },
    { value: "Packet", label: "Packet" },
    { value: "Tablespoon", label: "Tablespoon" },
    { value: "Teaspoon", label: "Teaspoon" },
  ];

  const initialCategories = [
    {
      id: 1,
      code: "FOOD655415",
      name: "Paneer Tikka",
      image: categoryImage,
      category: "Main Course",
      price: 299,
      stock: 25,
      lowStock: 5,
      status: "Active",
      recipe: [],
    },
    {
      id: 2,
      code: "FOOD655416",
      name: "Chicken Tikka",
      image: categoryImage2,
      category: "Starters",
      price: 350,
      stock: 15,
      lowStock: 5,
      status: "Active",
      recipe: [],
    },
    {
      id: 3,
      code: "FOOD655417",
      name: "Veg Manchurian",
      image: categoryImage3,
      category: "Main Course",
      price: 199,
      stock: 0,
      lowStock: 5,
      status: "Inactive",
      recipe: [],
    },
    {
      id: 4,
      code: "FOOD655418",
      name: "Crispy Corn",
      image: categoryImage,
      category: "Starters",
      price: 180,
      stock: 12,
      lowStock: 5,
      status: "Active",
      recipe: [],
    },
    {
      id: 5,
      code: "FOOD655419",
      name: "Fish Finger",
      image: categoryImage2,
      category: "Starters",
      price: 320,
      stock: 8,
      lowStock: 3,
      status: "Inactive",
      recipe: [],
    },
    {
      id: 6,
      code: "FOOD655420",
      name: "Hara Bhara Kebab",
      image: categoryImage3,
      category: "Main Course",
      price: 220,
      stock: 20,
      lowStock: 5,
      status: "Active",
      recipe: [],
    },
    {
      id: 7,
      code: "FOOD655421",
      name: "Chicken Lollipop",
      image: categoryImage2,
      category: "Starters",
      price: 280,
      stock: 3,
      lowStock: 5,
      status: "Active",
      recipe: [],
    },
  ];

  const [categories, setCategories] = useState(initialCategories);

  const [show, setShow] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [productCategory, setProductCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [status, setStatus] = useState("Active");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [activeRecipeItem, setActiveRecipeItem] = useState(null);

  const [recipeRows, setRecipeRows] = useState([
    {
      id: Date.now(),
      item: null,
      unit: null,
      quantity: "",
    },
  ]);

  const [recipeValidated, setRecipeValidated] = useState(false);

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setCategoryName("");
    setPreviewImage(null);
    setEditId(null);
    setProductCategory("");
    setPrice("");
    setStock("");
    setLowStock("");
    setStatus("Active");
    setValidated(false);

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

  const handleEdit = (category) => {
    setEditId(category.id);
    setCategoryName(category.name);
    setPreviewImage(category.image);
    setProductCategory(category.category);
    setPrice(category.price);
    setStock(category.stock);
    setLowStock(category.lowStock);
    setStatus(category.status);
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
      category: productCategory,
      price: Number(price),
      stock: Number(stock),
      lowStock: Number(lowStock),
      status: status,
      recipe: editId
        ? categories.find((item) => item.id === editId)?.recipe || []
        : [],
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

  const handleRecipeShow = (category) => {
    setActiveRecipeItem(category);

    setRecipeRows(
      category.recipe?.length
        ? category.recipe.map((row) => ({ ...row }))
        : [
            {
              id: Date.now(),
              item: null,
              unit: null,
              quantity: "",
            },
          ],
    );

    setRecipeValidated(false);
    setShowRecipe(true);
  };

  const handleRecipeClose = () => {
    setShowRecipe(false);
    setActiveRecipeItem(null);
    setRecipeRows([
      {
        id: Date.now(),
        item: null,
        unit: null,
        quantity: "",
      },
    ]);
    setRecipeValidated(false);
  };

  const handleAddRecipeRow = () => {
    setRecipeRows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        item: null,
        unit: null,
        quantity: "",
      },
    ]);
  };

  const handleRemoveRecipeRow = (id) => {
    setRecipeRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleRecipeChange = (id, field, value) => {
    setRecipeRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const ingredientOptions = categories
    .filter((item) => item.id !== activeRecipeItem?.id)
    .map((item) => ({
      value: item.id,
      label: item.name,
    }));

  const handleRecipeSubmit = (e) => {
    e.preventDefault();

    const isValid =
      recipeRows.length > 0 &&
      recipeRows.every(
        (row) =>
          row.item &&
          row.unit &&
          row.quantity !== "" &&
          Number(row.quantity) > 0,
      );

    if (!isValid) {
      setRecipeValidated(true);
      return;
    }

    setCategories((prev) =>
      prev.map((item) =>
        item.id === activeRecipeItem.id
          ? {
              ...item,
              recipe: recipeRows.map((row) => ({ ...row })),
            }
          : item,
      ),
    );

    handleRecipeClose();
  };

  const filteredCategories = categories.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header mb-2">
              <div>
                <h5 className="mb-0">Menu Items</h5>
                <p>All Menu Items list</p>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="customerType">
                  <Form.Select
                    className="w-100"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                  </Form.Select>
                </Form.Group>

                <button type="button" className="action-btn add">
                  <Search size={15} />
                </button>
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
                      <h5>Add Menu Items</h5>
                      <p>
                        Create and manage your <br /> Menu Items
                      </p>
                    </div>

                    <button
                      type="button"
                      className="resto-primary"
                      onClick={handleShow}
                    >
                      Add Menu Items
                    </button>
                  </div>

                  {filteredCategories.map((category) => (
                    <div className="pos-food-item add-food" key={category.id}>
                      <div className="pos-food-image">
                        {category.image ? (
                          <img src={category.image} alt={category.name} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <CloudUpload size={30} />
                          </div>
                        )}

                        <div
                          className={`under-category ${
                            category.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {category.category}
                        </div>
                      </div>

                      <div className="pos-food-details mb-3">
                        <small>{category.code}</small>
                        <h6>{category.name}</h6>

                        <div className="pos-price">
                          <p>₹{category.price}</p>
                          <small
                            className={`d-block mt-1 ${
                              category.stock <= category.lowStock
                                ? "text-danger"
                                : "text-secondary"
                            }`}
                          >
                            {category.stock} Stock
                          </small>
                        </div>
                      </div>

                      <div className="pos-food-btn d-flex gap-2">
                        <button
                          type="button"
                          className="action-btn add"
                          onClick={() => handleRecipeShow(category)}
                          title="Manage Recipe"
                        >
                          <CookingPot size={15} />
                        </button>

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
            <Modal.Title>Menu</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Menu Items" : "Add Menu Items"}
                </h5>

                <Row>
                  <Col md={7}>
                    <Form.Group className="mb-3" controlId="categoryName">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Enter stock quantity"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={7}>
                    <Form.Group controlId="productCategory">
                      <Form.Label>Select Category</Form.Label>
                      <Form.Select
                        className="w-100"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Low Stock Alert</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Enter low stock limit"
                        value={lowStock}
                        onChange={(e) => setLowStock(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        className="w-100"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
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

      <Modal
        size="lg"
        show={showRecipe}
        onHide={handleRecipeClose}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form noValidate onSubmit={handleRecipeSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Menu Recipe</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  Recipe Details
                </h5>

                {activeRecipeItem && (
                  <div className="mb-3">
                    <Form.Label>Menu Item</Form.Label>
                    <Form.Control
                      type="text"
                      value={activeRecipeItem.name}
                      readOnly
                    />
                  </div>
                )}

                <h5 className="qr-header">
                  <div className="dot"></div>
                  Ingredients
                </h5>

                {recipeRows.map((row, index) => (
                  <Row
                    className="align-items-end mb-3 payment-method-row"
                    key={row.id}
                  >
                    <Col md={12} xs={12} className="mb-3">
                      <div className="multi-select-wrapper">
                        <label className="form-label">Item Name</label>

                        <Select
                          options={ingredientOptions}
                          value={row.item}
                          onChange={(value) =>
                            handleRecipeChange(row.id, "item", value)
                          }
                          placeholder="Search item..."
                          isSearchable
                          classNamePrefix="restonest-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        {recipeValidated && !row.item && (
                          <small className="text-danger">
                            Please select an item.
                          </small>
                        )}
                      </div>
                    </Col>

                    <Col md={6} xs={12}>
                      <div className="multi-select-wrapper">
                        <label className="form-label">Unit</label>

                        <Select
                          options={unitOptions}
                          value={row.unit}
                          onChange={(value) =>
                            handleRecipeChange(row.id, "unit", value)
                          }
                          placeholder="Search unit..."
                          isSearchable
                          classNamePrefix="restonest-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        {recipeValidated && !row.unit && (
                          <small className="text-danger">
                            Please select a unit.
                          </small>
                        )}
                      </div>
                    </Col>

                    <Col md={4} xs={8}>
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Enter quantity"
                          value={row.quantity}
                          onChange={(e) =>
                            handleRecipeChange(
                              row.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          isInvalid={
                            recipeValidated &&
                            (!row.quantity || Number(row.quantity) <= 0)
                          }
                        />
                        {recipeValidated && !row.unit && (
                          <small className="text-danger">
                            Please put Quantity.
                          </small>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={2} xs={4}>
                      <div className="d-flex gap-2 mb-1">
                        {index === 0 ? (
                          <button
                            type="button"
                            className="action-btn add"
                            onClick={handleAddRecipeRow}
                            title="Add Ingredient"
                          >
                            <Plus size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleRemoveRecipeRow(row.id)}
                            title="Remove Ingredient"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                    </Col>

                    <div className="divider"></div>
                  </Row>
                ))}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="resto-cancel"
              onClick={handleRecipeClose}
            >
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              Save Recipe
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default MenuItem;
