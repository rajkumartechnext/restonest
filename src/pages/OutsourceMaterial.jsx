import { useEffect, useRef, useState } from "react";
import {
  Plus,
  CloudUpload,
  Hourglass,
  Search,
  FunnelPlus,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import categoryImage from "../assets/images/cate-1.jpg";

const outsourceMaterials = [
  {
    id: 625,
    name: "Mazza Pouch",
    image: categoryImage,
    stock: 0,
    type: "Imported",
    category: "Cold Drinks & Mocktails",
    price: "₹15.00",
    status: "Active",
  },
  {
    id: 626,
    name: "Coca Cola",
    image: categoryImage,
    stock: 20,
    type: "Local",
    category: "Cold Drinks & Mocktails",
    price: "₹40.00",
    status: "Active",
  },
  {
    id: 627,
    name: "Sprite",
    image: categoryImage,
    stock: 15,
    type: "Imported",
    category: "Cold Drinks & Mocktails",
    price: "₹35.00",
    status: "Active",
  },
  {
    id: 628,
    name: "Mineral Water",
    image: categoryImage,
    stock: 50,
    type: "Local",
    category: "Water",
    price: "₹20.00",
    status: "Active",
  },
];

function OutsourceMaterial() {
  const tableRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [showStock, setShowStock] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseStock = () => setShowStock(false);
  const handleUpload = () => setShowStock(true);

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
  }, []);

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5>Outsource Materials</h5>
                <p>All Kitchen Outsource Materials list</p>
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
              </div>
            </div>

            {/* MAIN PAGE DATATABLE */}

            <div className="table-wrapper">
              <table
                ref={tableRef}
                className="display nowrap restaurant-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ID.</th>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Product Type</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {outsourceMaterials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.id}</td>

                      <td>
                        <div className="company">
                          <img src={material.image} alt="" />
                          <b>{material.name}</b>
                        </div>
                      </td>

                      <td>{material.stock}</td>
                      <td>{material.type}</td>
                      <td>{material.category}</td>
                      <td>{material.price}</td>

                      <td>
                        <span className="stock-status success">
                          {material.status}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn other"
                            onClick={handleShow}
                          >
                            <Hourglass size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn add"
                            onClick={handleUpload}
                          >
                            <CloudUpload size={15} />
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

      {/* STOCK IN / STOCK OUT MODAL */}

      <Modal
        size="lg"
        show={showStock}
        onHide={handleCloseStock}
        centered
        dialogClassName="billing-modal-right"
      >
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Stock Update</Modal.Title>
          </Modal.Header>

          <Modal.Body className="settlement-body">
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>
                  Quick Stock Update
                </h5>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Product</Form.Label>
                      <Form.Control required type="number" />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Purchase Rate</Form.Label>
                      <Form.Control required type="number" />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Current Stock</Form.Label>
                      <Form.Control required type="number" />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Operation</Form.Label>
                      <Form.Select>
                        <option value="In Stock">Add Stock</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-2">
                      <Form.Label>Number of Guests</Form.Label>

                      <div className="d-flex gap-1 align-items-center">
                        <Form.Control required type="number" min="1" />

                        <button type="button" className="resto-primary">
                          <Plus size={16} /> 1
                        </button>

                        <button type="button" className="resto-primary">
                          <Plus size={16} /> 10
                        </button>
                      </div>
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
              onClick={handleCloseStock}
            >
              Cancel
            </button>

            <button className="resto-primary" type="submit">
              Add Stock
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* TRANSACTION HISTORY MODAL */}

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="billing-modal-right"
        className="stock"
      >
        <Modal.Header closeButton>
          <Modal.Title>Stock History - Mazza Pouch</Modal.Title>
        </Modal.Header>

        <Modal.Body className="settlement-body">
          <div className="settlement">
            <div className="pay-settlement">
              <h5 className="qr-header">
                <div className="dot"></div>
                Mazza Pouch
              </h5>

              <div className="order-info new mt-2">
                <div className="order-info-det">
                  <small>Total Stock In</small>
                  <h5>
                    <span>0</span>
                  </h5>
                </div>

                <div className="order-info-det">
                  <small>Low Stock Alert</small>
                  <h5>Not Set</h5>
                </div>

                <div className="order-info-det">
                  <small>Status</small>
                  <h5>
                    <span>Imported</span>
                  </h5>
                </div>

                <div className="order-info-det">
                  <small>Status</small>
                  <h5>1</h5>
                </div>
              </div>

              {/* TRANSACTION FILTERS */}

              <div className="filter mt-3">
                <div>
                  <Form.Select>
                    <option value="All">All Transactions</option>
                    <option value="In Stock">Stock In</option>
                    <option value="Out Stock">Stock Out</option>
                    <option value="Adjustment">Adjustment</option>
                    <option value="Initial">Initial</option>
                  </Form.Select>
                </div>

                <div>
                  <Form.Control type="date" />
                </div>

                <div>
                  <Form.Control type="date" />
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="action-btn add">
                    <FunnelPlus size={15} />
                  </button>

                  <button type="button" className="action-btn other">
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* NORMAL REACT TABLE */}

              <div className="table-wrapper mt-3">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Previous</th>
                      <th>New</th>
                      <th>Notes</th>
                      <th>Purchese Rate</th>
                      <th>User</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>29 Aug 2026, 02:56 PM</td>

                      <td>
                        <span className="stock-status denger history">Out</span>
                      </td>

                      <td>
                        <b className="text-danger">- 1</b>
                      </td>

                      <td>0</td>
                      <td>0</td>
                      <td>Order Via POS</td>
                      <td>N/A</td>
                      <td>System</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="resto-cancel" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OutsourceMaterial;
