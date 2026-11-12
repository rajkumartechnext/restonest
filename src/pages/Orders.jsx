import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import {
  BanknoteCheck,
  CreditCard,
  CreditCardCheck,
  FolderDown,
  FunnelPlus,
  Landmark,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  Wallet,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Cash Payments",
    count: "620.00",
    icon: BanknoteCheck,
    color: "#57976a",
    bg: "#edf6ef",
  },
  {
    title: "Total Card Payments",
    count: "1,930.00",
    icon: CreditCard,
    color: "#6685ad",
    bg: "#eff3f8",
  },
  {
    title: "Total Online Payments",
    count: "1,743.00",
    icon: ScanLine,
    color: "#d9a36d",
    bg: "#fbf4eb",
  },
  {
    title: "Net Banking Payments",
    count: "0.00",
    icon: Landmark,
    color: "#d98d7d",
    bg: "#fcf1ef",
  },
];

const initialOrder = {
  orderId: "RSF/0/2026",
  tableNo: "30",
  roomNo: "N/A",
  orderType: "Table",
  total: 620,
  gst: 29.5,
  due: 0,
  discount: 0,
  paymentMode: "Cash",
  status: "Success",
  customerName: "Customer",
  mobileNumber: "9876543210",
  orderDate: "2026-11-03",
};

const initialOrders = [
  {
    id: 1,
    orderId: "RSF/0/2026",
    tableNo: "30",
    roomNo: "N/A",
    orderType: "Table",
    total: 620,
    gst: 29.5,
    due: 0,
    discount: 0,
    paymentMode: "Cash",
    status: "Success",
    customerName: "Rahul Sharma",
    mobileNumber: "9876543210",
    orderDate: "2026-11-03",
  },
  {
    id: 2,
    orderId: "RSF/1/2026",
    tableNo: "12",
    roomNo: "N/A",
    orderType: "Table",
    total: 850,
    gst: 40.48,
    due: 0,
    discount: 50,
    paymentMode: "Card",
    status: "Success",
    customerName: "Amit Das",
    mobileNumber: "9876543211",
    orderDate: "2026-11-03",
  },
  {
    id: 3,
    orderId: "RSF/2/2026",
    tableNo: "N/A",
    roomNo: "N/A",
    orderType: "Parcel",
    total: 450,
    gst: 21.43,
    due: 100,
    discount: 0,
    paymentMode: "Online",
    status: "Pending",
    customerName: "Priya Roy",
    mobileNumber: "9876543212",
    orderDate: "2026-11-02",
  },
  {
    id: 4,
    orderId: "RSF/3/2026",
    tableNo: "08",
    roomNo: "N/A",
    orderType: "Table",
    total: 1250,
    gst: 59.52,
    due: 0,
    discount: 100,
    paymentMode: "Card",
    status: "Success",
    customerName: "Suman Ghosh",
    mobileNumber: "9876543213",
    orderDate: "2026-11-02",
  },
  {
    id: 5,
    orderId: "RSF/4/2026",
    tableNo: "N/A",
    roomNo: "N/A",
    orderType: "Parcel",
    total: 320,
    gst: 15.24,
    due: 0,
    discount: 20,
    paymentMode: "Cash",
    status: "Success",
    customerName: "Rakesh Singh",
    mobileNumber: "9876543214",
    orderDate: "2026-11-01",
  },
  {
    id: 6,
    orderId: "RSF/5/2026",
    tableNo: "15",
    roomNo: "N/A",
    orderType: "Table",
    total: 980,
    gst: 46.67,
    due: 200,
    discount: 0,
    paymentMode: "Online",
    status: "Pending",
    customerName: "Ananya Sen",
    mobileNumber: "9876543215",
    orderDate: "2026-11-01",
  },
  {
    id: 7,
    orderId: "RSF/6/2026",
    tableNo: "N/A",
    roomNo: "N/A",
    orderType: "Parcel",
    total: 540,
    gst: 25.71,
    due: 0,
    discount: 40,
    paymentMode: "Net Banking",
    status: "Success",
    customerName: "Sourav Paul",
    mobileNumber: "9876543216",
    orderDate: "2026-10-31",
  },
  {
    id: 8,
    orderId: "RSF/7/2026",
    tableNo: "22",
    roomNo: "N/A",
    orderType: "Table",
    total: 720,
    gst: 34.29,
    due: 0,
    discount: 0,
    paymentMode: "Cash",
    status: "Success",
    customerName: "Puja Dey",
    mobileNumber: "9876543217",
    orderDate: "2026-10-31",
  },
  {
    id: 9,
    orderId: "RSF/8/2026",
    tableNo: "N/A",
    roomNo: "N/A",
    orderType: "Parcel",
    total: 390,
    gst: 18.57,
    due: 0,
    discount: 0,
    paymentMode: "Card",
    status: "Success",
    customerName: "Arindam Roy",
    mobileNumber: "9876543218",
    orderDate: "2026-10-30",
  },
  {
    id: 10,
    orderId: "RSF/9/2026",
    tableNo: "05",
    roomNo: "N/A",
    orderType: "Table",
    total: 1100,
    gst: 52.38,
    due: 150,
    discount: 50,
    paymentMode: "Cash",
    status: "Pending",
    customerName: "Moumita Das",
    mobileNumber: "9876543219",
    orderDate: "2026-10-30",
  },
];

function Orders() {
  const [show, setShow] = useState(false);
  const [showDateSearch, setShowDateSearch] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [customerType, setCustomerType] = useState("Regular");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [discountType, setDiscountType] = useState("Percentage");
  const [discountAmount, setDiscountAmount] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, mode: "Cash", amount: "620" },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(initialOrder);

  const tableRef = useRef(null);

  const filteredOrders = initialOrders.filter((order) => {
    const afterStartDate =
      !appliedStartDate || order.orderDate >= appliedStartDate;

    const beforeEndDate = !appliedEndDate || order.orderDate <= appliedEndDate;

    return afterStartDate && beforeEndDate;
  });

  const totalAmount = Number(selectedOrder.total);
  const discountValue = Math.max(0, Number(discountAmount) || 0);

  const discount =
    discountType === "Percentage"
      ? Math.min(
          totalAmount,
          (totalAmount * Math.min(discountValue, 100)) / 100,
        )
      : Math.min(totalAmount, discountValue);

  const payableAmount = Math.max(0, totalAmount - discount);

  const paidAmount = paymentMethods.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0,
  );

  const remainingAmount = payableAmount - paidAmount;

  const footerTotal = filteredOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  const footerGst = filteredOrders.reduce(
    (total, order) => total + order.gst,
    0,
  );

  const footerDue = filteredOrders.reduce(
    (total, order) => total + order.due,
    0,
  );

  const footerDiscount = filteredOrders.reduce(
    (total, order) => total + order.discount,
    0,
  );

  const handleClose = () => {
    setShow(false);
  };

  const resetPaymentForm = (order = initialOrder) => {
    setPaymentStatus("Paid");
    setCustomerType("Regular");
    setCustomerName(order.customerName || "");
    setMobileNumber(order.mobileNumber || "");
    setDiscountType("Fixed");
    setDiscountAmount(String(order.discount || ""));
    setPaymentMethods([
      {
        id: 1,
        mode: order.paymentMode || "Cash",
        amount: String(
          Math.max(0, order.total - (order.discount || 0) - (order.due || 0)),
        ),
      },
    ]);
  };

  const handleShow = (order = initialOrder) => {
    setSelectedOrder(order);
    resetPaymentForm(order);
    setShow(true);
  };

  const handleAddPayment = () => {
    setPaymentMethods((prev) => [
      ...prev,
      {
        id: Date.now(),
        mode: "Cash",
        amount: "",
      },
    ]);
  };

  const handleRemovePayment = (id) => {
    setPaymentMethods((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  };

  const handlePaymentChange = (id, field, value) => {
    setPaymentMethods((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleCompletePayment = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!mobileNumber.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (
      paymentMethods.some((item) => !item.amount || Number(item.amount) <= 0)
    ) {
      alert("Please enter a valid amount for every payment method.");
      return;
    }

    if (Math.abs(remainingAmount) > 0.009) {
      alert(
        remainingAmount > 0
          ? `Please collect the remaining amount of ₹${remainingAmount.toFixed(2)}.`
          : `Payment exceeds the payable amount by ₹${Math.abs(remainingAmount).toFixed(2)}.`,
      );
      return;
    }

    const paymentDetails = paymentMethods
      .map((item) => `${item.mode}: ₹${Number(item.amount).toFixed(2)}`)
      .join("\n");

    alert(
      `Payment completed successfully!\n\nOrder ID: ${selectedOrder.orderId}\nCustomer: ${customerName}\nMobile: ${mobileNumber}\nPayable Amount: ₹${payableAmount.toFixed(2)}\n\n${paymentDetails}`,
    );

    setShow(false);
    resetPaymentForm();
  };

  useEffect(() => {
    const tableElement = tableRef.current;

    if (!tableElement || !window.jQuery || !window.jQuery.fn.DataTable) {
      return undefined;
    }

    const table = window.jQuery(tableElement);

    if (window.jQuery.fn.DataTable.isDataTable(tableElement)) {
      table.DataTable().destroy();
    }

    const dataTable = table.DataTable({
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
      if (
        window.jQuery &&
        window.jQuery.fn.DataTable &&
        window.jQuery.fn.DataTable.isDataTable(tableElement)
      ) {
        dataTable.destroy();
      }
    };
  }, [filteredOrders]);

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <Row className="g-2 mb-2">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <Col key={index} xs={6} lg={3} className="mb-1">
                  <div className="dashboard-stat-card">
                    <div className="stat-card-top">
                      <span className="stat-title">{item.title}</span>

                      <span
                        className="stat-icon"
                        style={{
                          backgroundColor: item.bg,
                          color: item.color,
                        }}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </span>
                    </div>

                    <h3 className="stat-count">{item.count}</h3>
                  </div>
                </Col>
              );
            })}
          </Row>

          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <div>
                  <h5 className="mb-0">All Orders</h5>
                </div>

                <div className="resto-badge resto-bg-primary">
                  Table:{" "}
                  {
                    filteredOrders.filter(
                      (order) => order.orderType === "Table",
                    ).length
                  }
                </div>

                <div className="resto-badge resto-bg-secondary">
                  Parcel:{" "}
                  {
                    filteredOrders.filter(
                      (order) => order.orderType === "Parcel",
                    ).length
                  }
                </div>
              </div>

              <div className="sub-right d-flex gap-2 flex-wrap align-items-center">
                {showDateSearch && (
                  <>
                    <Form className="date-search" onSubmit={handleSearch}>
                      <InputGroup className="search-box-date">
                        <InputGroup.Text>
                          <Search size={15} />
                        </InputGroup.Text>

                        <Form.Control
                          type="date"
                          className="fst-one"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          aria-label="Start date"
                        />

                        <Form.Control
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          aria-label="End date"
                        />
                      </InputGroup>
                    </Form>

                    <button
                      type="button"
                      className="action-btn add"
                      onClick={handleSearch}
                    >
                      <Search size={15} />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="action-btn other"
                  onClick={() => setShowDateSearch(!showDateSearch)}
                >
                  <FunnelPlus size={15} />
                </button>

                <Link to="/table" className="action-btn other">
                  <FolderDown size={15} />
                </Link>
              </div>
            </div>

            <div className="table-wrapper">
              <table
                ref={tableRef}
                className="display nowrap order restaurant-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Consumer Class</th>
                    <th>Total</th>
                    <th>Gst</th>
                    <th>Due</th>
                    <th>Discount</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderId}</td>

                      <td>
                        <b>{order.customerName}</b>
                      </td>

                      <td>{order.total.toFixed(2)}</td>
                      <td>{order.gst.toFixed(2)}</td>
                      <td>{order.due.toFixed(2)}</td>
                      <td>{order.discount.toFixed(2)}</td>
                      <td>{order.paymentMode}</td>

                      <td>
                        <span
                          className={`stock-status ${
                            order.status === "Success" ? "success" : "warning"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button type="button" className="action-btn other">
                            <ReceiptText size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => handleShow(order)}
                          >
                            <CreditCardCheck size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="fixed-table-footer">
                    <td colSpan={2}>Total ({filteredOrders.length} Orders)</td>

                    <td>
                      <b>{footerTotal.toFixed(2)}</b>
                    </td>

                    <td>{footerGst.toFixed(2)}</td>

                    <td>{footerDue.toFixed(2)}</td>

                    <td>
                      <b>{footerDiscount.toFixed(2)}</b>
                    </td>

                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-4">
                  No orders found for the selected date range.
                </div>
              )}
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
        <Modal.Header closeButton>
          <Modal.Title>Payment Settlement</Modal.Title>
        </Modal.Header>

        <Modal.Body className="settlement-body">
          <Form id="paymentForm" onSubmit={handleCompletePayment}>
            <div className="settlement">
              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>Order Information
                </h5>

                <div className="order-info">
                  <div className="order-info-det">
                    <small>Order ID</small>
                    <h5>{selectedOrder.orderId}</h5>
                  </div>

                  <div className="order-info-det">
                    <small>Table No</small>
                    <h5>{selectedOrder.tableNo}</h5>
                  </div>

                  <div className="order-info-det">
                    <small>Room No</small>
                    <h5>{selectedOrder.roomNo}</h5>
                  </div>

                  <div className="order-info-det">
                    <small>Order Type</small>
                    <h5>{selectedOrder.orderType}</h5>
                  </div>
                </div>
              </div>

              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>Amount Details
                </h5>

                <div className="order-info">
                  <div className="order-info-det">
                    <small>Total Amount</small>
                    <h5>₹{totalAmount.toFixed(2)}</h5>
                  </div>

                  <div className="order-info-det">
                    <small>GST (CGST+SGST)</small>
                    <h5>₹{Number(selectedOrder.gst).toFixed(2)}</h5>
                  </div>

                  <div className="wallet">
                    <div>
                      <small>Payable Amount</small>
                      <h5>₹{payableAmount.toFixed(2)}</h5>
                    </div>

                    <div className="wallet-icon">
                      <Wallet size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>Discount
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="discountType">
                      <Form.Label>Discount Type</Form.Label>
                      <Form.Select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                      >
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed">Fixed Amount (₹)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="discountAmount">
                      <Form.Label>Discount Amount</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max={discountType === "Percentage" ? 100 : totalAmount}
                        step="0.01"
                        placeholder="Enter discount"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {discount > 0 && (
                  <div className="pos-summary-row mt-3">
                    <span>Discount Applied</span>
                    <strong>₹{discount.toFixed(2)}</strong>
                  </div>
                )}
              </div>

              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>Customer Details
                </h5>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="customerType">
                      <Form.Label>User Type</Form.Label>
                      <Form.Select
                        value={customerType}
                        onChange={(e) => setCustomerType(e.target.value)}
                      >
                        <option value="Regular">Regular</option>
                        <option value="Family">Family</option>
                        <option value="VIP">VIP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={8}>
                    <Form.Group className="mb-2" controlId="customerName">
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="mobileNumber">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNumber(e.target.value.replace(/\D/g, ""))
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="pay-settlement">
                <h5 className="qr-header">
                  <div className="dot"></div>Payment Methods
                </h5>

                {paymentMethods.map((item, index) => (
                  <Row
                    key={item.id}
                    className="align-items-end mb-2 payment-method-row"
                  >
                    <Col md={4} xs={5}>
                      <Form.Group controlId={`paymentMode-${item.id}`}>
                        <Form.Label>Payment Mode</Form.Label>
                        <Form.Select
                          value={item.mode}
                          onChange={(e) =>
                            handlePaymentChange(item.id, "mode", e.target.value)
                          }
                        >
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="Online">Online</option>
                          <option value="Net Banking">Net Banking</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6} xs={5}>
                      <Form.Group controlId={`paymentAmount-${item.id}`}>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Enter amount"
                          value={item.amount}
                          onChange={(e) =>
                            handlePaymentChange(
                              item.id,
                              "amount",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2} xs={2}>
                      {index === 0 ? (
                        <button
                          type="button"
                          className="action-btn add mb-1"
                          onClick={handleAddPayment}
                        >
                          <Plus size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="action-btn delete mb-1"
                          onClick={() => handleRemovePayment(item.id)}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </Col>
                  </Row>
                ))}

                <div className="pos-summary-row mt-3">
                  <span>Total Entered Payment</span>
                  <strong>₹{paidAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="split-payment-fields mb-2 w-100">
            <h5 className="qr-header">
              <div className="dot"></div>Payable Amount
            </h5>

            <div className="pos-summary-row">
              <span>Total Payment:</span>
              <strong>₹{payableAmount.toFixed(2)}</strong>
            </div>

            <div className="pos-summary-row">
              <span>Paid Amount:</span>
              <strong>₹{paidAmount.toFixed(2)}</strong>
            </div>

            <div className="pos-summary-row">
              <span>Remaining:</span>
              <strong
                style={{
                  color:
                    remainingAmount < -0.009
                      ? "#dc3545"
                      : remainingAmount > 0.009
                        ? "#d98d00"
                        : "#278a0e",
                }}
              >
                ₹{Math.abs(remainingAmount).toFixed(2)}
                {remainingAmount < -0.009 ? " (Excess)" : ""}
              </strong>
            </div>
          </div>

          <button type="button" className="resto-cancel" onClick={handleClose}>
            Cancel
          </button>

          <button className="resto-primary" type="submit" form="paymentForm">
            Complete Payment
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Orders;
