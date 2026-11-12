import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  CloudUpload,
  Hourglass,
  Search,
  FunnelPlus,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const emptyForm = {
  itemName: "",
  unitType: "kg",
  currentStock: "",
};

const emptyTransaction = {
  type: "In Stock",
  quantity: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

const initialMaterials = [
  {
    id: "001",
    itemName: "CORN",
    unitType: "kg",
    currentStock: 0,
    transactions: [],
  },
  {
    id: "002",
    itemName: "RICE",
    unitType: "kg",
    currentStock: 25,
    transactions: [],
  },
  {
    id: "003",
    itemName: "CORN",
    unitType: "kg",
    currentStock: 0,
    transactions: [],
  },
  {
    id: "004",
    itemName: "RICE",
    unitType: "kg",
    currentStock: 25,
    transactions: [],
  },
];

const getStatus = (stock) => (Number(stock) > 0 ? "In Stock" : "Low Stock");

function KitchenMaterial() {
  const tableRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const materialsRef = useRef([]);
  const actionHandlersRef = useRef({});

  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem("restonest-kitchen-materials");
      return saved ? JSON.parse(saved) : initialMaterials;
    } catch {
      return initialMaterials;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [editId, setEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [transactionData, setTransactionData] = useState(emptyTransaction);

  const [formError, setFormError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  // Selected filter values
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied filter values
  const [appliedTransactionFilter, setAppliedTransactionFilter] =
    useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  // Save materials
  useEffect(() => {
    try {
      localStorage.setItem(
        "restonest-kitchen-materials",
        JSON.stringify(materials),
      );
    } catch (error) {
      console.error("Unable to save materials:", error);
    }
  }, [materials]);

  // Keep latest materials available for delegated DataTable actions
  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);

  // Search materials
  const filteredMaterials = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return materials.filter(
      (material) =>
        material.itemName.toLowerCase().includes(search) ||
        material.id.toLowerCase().includes(search),
    );
  }, [materials, searchTerm]);

  // Current selected material
  const currentMaterial = materials.find(
    (material) => material.id === selectedMaterial?.id,
  );

  // Filter transaction history using applied filters
  const selectedTransactions = useMemo(() => {
    if (!currentMaterial) return [];

    return currentMaterial.transactions.filter((transaction) => {
      const matchesType =
        appliedTransactionFilter === "All" ||
        transaction.type === appliedTransactionFilter;

      const matchesFrom =
        !appliedFromDate || transaction.date >= appliedFromDate;

      const matchesTo = !appliedToDate || transaction.date <= appliedToDate;

      return matchesType && matchesFrom && matchesTo;
    });
  }, [
    currentMaterial,
    appliedTransactionFilter,
    appliedFromDate,
    appliedToDate,
  ]);

  // Add material
  const handleAddMaterial = () => {
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  // Edit material
  const handleEditMaterial = (material) => {
    setEditId(material.id);

    setFormData({
      itemName: material.itemName,
      unitType: material.unitType,
      currentStock: String(material.currentStock),
    });

    setFormError("");
    setShowForm(true);
  };

  // Close add/edit modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  // Submit add/edit form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const itemName = formData.itemName.trim();
    const unitType = formData.unitType;
    const currentStock = Number(formData.currentStock);

    if (!itemName || formData.currentStock === "") {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(currentStock) || currentStock < 0) {
      setFormError("Please enter a valid stock quantity.");
      return;
    }

    const duplicate = materials.some(
      (material) =>
        material.id !== editId &&
        material.itemName.toLowerCase() === itemName.toLowerCase(),
    );

    if (duplicate) {
      setFormError("This material already exists.");
      return;
    }

    if (editId) {
      setMaterials((previous) =>
        previous.map((material) =>
          material.id === editId
            ? {
                ...material,
                itemName,
                unitType,
                currentStock,
              }
            : material,
        ),
      );
    } else {
      const nextId =
        Math.max(0, ...materials.map((material) => Number(material.id) || 0)) +
        1;

      const newMaterial = {
        id: String(nextId).padStart(3, "0"),
        itemName,
        unitType,
        currentStock,
        transactions: [],
      };

      setMaterials((previous) => [...previous, newMaterial]);
    }

    handleCloseForm();
  };

  // Delete material
  const handleDeleteClick = (material) => {
    setDeletingId(material.id);
    setShowDelete(true);
  };

  const handleDeleteMaterial = () => {
    setMaterials((previous) =>
      previous.filter((material) => material.id !== deletingId),
    );

    setShowDelete(false);
    setDeletingId(null);
  };

  // Open stock modal
  const handleOpenStock = (material) => {
    setSelectedMaterial(material);

    setTransactionData({
      ...emptyTransaction,
      date: new Date().toISOString().slice(0, 10),
    });

    setTransactionError("");
    setShowStock(true);
  };

  // Close stock modal
  const handleCloseStock = () => {
    setShowStock(false);
    setSelectedMaterial(null);
    setTransactionData(emptyTransaction);
    setTransactionError("");
  };

  // Submit stock transaction
  const handleTransactionSubmit = (event) => {
    event.preventDefault();

    const quantity = Number(transactionData.quantity);

    if (
      transactionData.quantity === "" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setTransactionError("Please enter a valid quantity greater than zero.");
      return;
    }

    const material = materialsRef.current.find(
      (item) => item.id === selectedMaterial?.id,
    );

    if (!material) return;

    if (
      transactionData.type === "Out Stock" &&
      quantity > Number(material.currentStock)
    ) {
      setTransactionError("Stock out quantity cannot exceed current stock.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type: transactionData.type,
      quantity,
      date: transactionData.date,
      note: transactionData.note.trim(),
    };

    setMaterials((previous) =>
      previous.map((item) => {
        if (item.id !== selectedMaterial.id) return item;

        const newStock =
          Number(item.currentStock) +
          (transactionData.type === "In Stock" ? quantity : -quantity);

        return {
          ...item,
          currentStock: Number(newStock.toFixed(2)),
          transactions: [...item.transactions, transaction],
        };
      }),
    );

    handleCloseStock();
  };

  // Open transaction history
  const handleOpenHistory = (material) => {
    setSelectedMaterial(material);

    setTransactionFilter("All");
    setFromDate("");
    setToDate("");

    setAppliedTransactionFilter("All");
    setAppliedFromDate("");
    setAppliedToDate("");

    setShowHistory(true);
  };

  // Apply transaction filters
  const handleApplyFilter = () => {
    if (fromDate && toDate && fromDate > toDate) {
      alert("From date cannot be greater than To date.");
      return;
    }

    setAppliedTransactionFilter(transactionFilter);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  // Reset transaction filters
  const handleResetFilter = () => {
    setTransactionFilter("All");
    setFromDate("");
    setToDate("");

    setAppliedTransactionFilter("All");
    setAppliedFromDate("");
    setAppliedToDate("");
  };

  // Delegated click handling for DataTables FixedColumns buttons
  actionHandlersRef.current = {
    history: handleOpenHistory,
    edit: handleEditMaterial,
    stock: handleOpenStock,
    delete: handleDeleteClick,
  };

  useEffect(() => {
    const wrapper = tableWrapperRef.current;

    if (!wrapper) return;

    const handleActionClick = (event) => {
      const button = event.target.closest("[data-material-action]");

      if (!button || !wrapper.contains(button)) return;

      const action = button.dataset.materialAction;
      const materialId = button.dataset.materialId;

      const material = materialsRef.current.find(
        (item) => item.id === materialId,
      );

      if (!material) return;

      const actionHandler = actionHandlersRef.current[action];

      if (actionHandler) {
        actionHandler(material);
      }
    };

    wrapper.addEventListener("click", handleActionClick);

    return () => {
      wrapper.removeEventListener("click", handleActionClick);
    };
  }, []);

  // Main page DataTable initialization
  useEffect(() => {
    const $ = window.jQuery;

    if (!tableRef.current || !$ || !$.fn || !$.fn.DataTable) {
      return;
    }

    const tableElement = tableRef.current;

    if ($.fn.DataTable.isDataTable(tableElement)) {
      $(tableElement).DataTable().destroy();
    }

    const dataTable = $(tableElement).DataTable({
      scrollX: true,
      scrollCollapse: true,
      searching: false,
      paging: false,
      lengthChange: false,
      info: false,
      ordering: true,
      autoWidth: false,
      order: [],
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }
    };
  }, [filteredMaterials]);

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5>All Materials</h5>
                <p>All Kitchen Materials list</p>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                <div className="search-wrapper mt-0">
                  <Form.Group>
                    <Form.Control
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search products...."
                    />
                    <Search size={18} />
                  </Form.Group>
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddMaterial}
                >
                  <Plus size={15} /> Add Materials
                </button>
              </div>
            </div>

            {/* MAIN PAGE DATATABLE */}

            <div className="table-wrapper" ref={tableWrapperRef}>
              <table
                ref={tableRef}
                className="display nowrap restaurant-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ID.</th>
                    <th>Item Name</th>
                    <th>Unit Type</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.id}</td>

                      <td>
                        <b>{material.itemName}</b>
                      </td>

                      <td>{material.unitType}</td>

                      <td>{Number(material.currentStock).toFixed(2)}</td>

                      <td>
                        <span
                          className={`stock-status ${
                            getStatus(material.currentStock) === "In Stock"
                              ? "success"
                              : "denger"
                          }`}
                        >
                          {getStatus(material.currentStock)}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn other"
                            data-material-action="history"
                            data-material-id={material.id}
                          >
                            <Hourglass size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn edit"
                            data-material-action="edit"
                            data-material-id={material.id}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn add"
                            data-material-action="stock"
                            data-material-id={material.id}
                          >
                            <CloudUpload size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn delete"
                            data-material-action="delete"
                            data-material-id={material.id}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>

      {/* ADD / EDIT MATERIAL MODAL */}

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
              {editId ? "Edit Material" : "Add Material"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  {editId ? "Edit Material" : "Add Material"}
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control
                        required
                        value={formData.itemName}
                        placeholder="Enter item name"
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            itemName: event.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Unit Type</Form.Label>
                      <Form.Select
                        value={formData.unitType}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            unitType: event.target.value,
                          }))
                        }
                      >
                        <option value="kg">Kg</option>
                        <option value="gram">Gram</option>
                        <option value="litre">Litre</option>
                        <option value="ml">ML</option>
                        <option value="piece">Piece</option>
                        <option value="packet">Packet</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {editId ? "Current Stock" : "Initial Stock"}
                      </Form.Label>

                      <Form.Control
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.currentStock}
                        placeholder="Enter stock quantity"
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            currentStock: event.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
              {editId ? "Save Changes" : "Add Material"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}

      <Modal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          setDeletingId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this material? This action cannot be
          undone.
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowDelete(false);
              setDeletingId(null);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="resto-cancel"
            onClick={handleDeleteMaterial}
          >
            Delete Material
          </button>
        </Modal.Footer>
      </Modal>

      {/* STOCK IN / STOCK OUT MODAL */}

      <Modal
        size="lg"
        show={showStock}
        onHide={handleCloseStock}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form onSubmit={handleTransactionSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Stock Management</Modal.Title>
          </Modal.Header>

          <Modal.Body className="settlement-body">
            {selectedMaterial && (
              <div className="settlement">
                <div className="pay-settlement">
                  <h5 className="qr-header">
                    <div className="dot"></div>
                    {currentMaterial?.itemName} - Stock Update
                  </h5>

                  <div className="order-info new mt-2">
                    <div className="order-info-det">
                      <small>Current Stock</small>

                      <h5>
                        {Number(currentMaterial?.currentStock || 0).toFixed(2)}
                        <span> {currentMaterial?.unitType}</span>
                      </h5>
                    </div>
                  </div>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Transaction Type</Form.Label>

                        <Form.Select
                          value={transactionData.type}
                          onChange={(event) => {
                            setTransactionData((previous) => ({
                              ...previous,
                              type: event.target.value,
                            }));

                            setTransactionError("");
                          }}
                        >
                          <option value="In Stock">Stock In</option>
                          <option value="Out Stock">Stock Out</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Quantity ({currentMaterial?.unitType})
                        </Form.Label>

                        <Form.Control
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={transactionData.quantity}
                          placeholder="Enter quantity"
                          onChange={(event) =>
                            setTransactionData((previous) => ({
                              ...previous,
                              quantity: event.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Transaction Date</Form.Label>

                        <Form.Control
                          required
                          type="date"
                          value={transactionData.date}
                          onChange={(event) =>
                            setTransactionData((previous) => ({
                              ...previous,
                              date: event.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>

                        <Form.Control
                          value={transactionData.note}
                          placeholder="Enter note (optional)"
                          onChange={(event) =>
                            setTransactionData((previous) => ({
                              ...previous,
                              note: event.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {transactionError && (
                    <div className="text-danger mt-2" role="alert">
                      {transactionError}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="resto-cancel"
              onClick={handleCloseStock}
            >
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              {transactionData.type === "In Stock"
                ? "Add Stock"
                : "Remove Stock"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* TRANSACTION HISTORY MODAL - NORMAL TABLE */}

      <Modal
        size="xl"
        show={showHistory}
        onHide={() => setShowHistory(false)}
        centered
        dialogClassName="billing-modal-right"
        className="stock"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentMaterial?.itemName} - Transaction History
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="settlement-body">
          {currentMaterial && (
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  Order Information
                </h5>

                <div className="order-info new mt-2">
                  <div className="order-info-det">
                    <small>Total Stock In</small>

                    <h5>
                      {currentMaterial.transactions
                        .filter((item) => item.type === "In Stock")
                        .reduce((sum, item) => sum + Number(item.quantity), 0)
                        .toFixed(2)}
                      <span> {currentMaterial.unitType}</span>
                    </h5>
                  </div>

                  <div className="order-info-det">
                    <small>Total Stock Out</small>

                    <h5>
                      {currentMaterial.transactions
                        .filter((item) => item.type === "Out Stock")
                        .reduce((sum, item) => sum + Number(item.quantity), 0)
                        .toFixed(2)}
                      <span> {currentMaterial.unitType}</span>
                    </h5>
                  </div>

                  <div className="order-info-det">
                    <small>Current Balance</small>

                    <h5>
                      {Number(currentMaterial.currentStock).toFixed(2)}
                      <span> {currentMaterial.unitType}</span>
                    </h5>
                  </div>

                  <div className="order-info-det">
                    <small>Total Transactions</small>
                    <h5>{currentMaterial.transactions.length}</h5>
                  </div>
                </div>

                {/* TRANSACTION FILTERS */}

                <div className="filter mt-3">
                  <div>
                    <Form.Select
                      value={transactionFilter}
                      onChange={(event) =>
                        setTransactionFilter(event.target.value)
                      }
                    >
                      <option value="All">All Transactions</option>
                      <option value="In Stock">Stock In</option>
                      <option value="Out Stock">Stock Out</option>
                    </Form.Select>
                  </div>

                  <div>
                    <Form.Control
                      type="date"
                      value={fromDate}
                      onChange={(event) => setFromDate(event.target.value)}
                    />
                  </div>

                  <div>
                    <Form.Control
                      type="date"
                      value={toDate}
                      onChange={(event) => setToDate(event.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="action-btn add"
                      title="Apply Filter"
                      onClick={handleApplyFilter}
                    >
                      <FunnelPlus size={15} />
                    </button>

                    <button
                      type="button"
                      className="action-btn other"
                      title="Reset Filter"
                      onClick={handleResetFilter}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* NORMAL REACT TABLE */}

                <div className="table-wrapper mt-3">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID.</th>
                        <th>Transaction Type</th>
                        <th>Item Name</th>
                        <th>Unit Type</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedTransactions.length > 0 ? (
                        selectedTransactions.map((transaction, index) => (
                          <tr key={transaction.id}>
                            <td>{String(index + 1).padStart(3, "0")}</td>

                            <td>
                              <span
                                className={`stock-status ${
                                  transaction.type === "In Stock"
                                    ? "success"
                                    : "denger"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>

                            <td>
                              <b>{currentMaterial.itemName}</b>
                            </td>

                            <td>{currentMaterial.unitType}</td>

                            <td>{Number(transaction.quantity).toFixed(2)}</td>

                            <td>{transaction.date}</td>

                            <td>{transaction.note || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="table-empty py-4 text-center"
                          >
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="resto-cancel"
            onClick={() => setShowHistory(false)}
          >
            Close
          </button>

          <button
            type="button"
            className="resto-primary"
            onClick={() => {
              if (currentMaterial) {
                handleOpenStock(currentMaterial);
                setShowHistory(false);
              }
            }}
          >
            <Plus size={15} /> Add Stock Transaction
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default KitchenMaterial;
