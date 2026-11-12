import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import {
  X,
  FunnelPlus,
  FolderInput,
  BanknoteCheck,
  CreditCard,
  ScanLine,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const stats = [
  {
    title: "Total In",
    count: "620.00",
    icon: BanknoteCheck,
    color: "#57976a",
    bg: "#cef3d6",
    border: "1px solid #57976a",
  },
  {
    title: "Total Out",
    count: "1,930.00",
    icon: CreditCard,
    color: "#6685ad",
    bg: "#dde8f7",
    border: "1px solid #6685ad",
  },
  {
    title: "Total Items",
    count: "1,743.00",
    icon: ScanLine,
    color: "#d9a36d",
    bg: "#ffebd2",
    border: "1px solid #d9a36d",
  },
];

const transactions = [
  {
    id: 1,
    productName: "Rice",
    type: "Stock In",
    productType: "Raw Material",
    quantity: "20 kg",
    previousQty: "15 kg",
    newQty: "35 kg",
    purchaseRate: "₹52.00",
    date: "2026-11-05",
    dateTime: "05 Nov 2026, 10:30 AM",
    stockStatus: "Available",
    currentStock: "In Stock",
  },
  {
    id: 2,
    productName: "Cooking Oil",
    type: "Stock In",
    productType: "Raw Material",
    quantity: "10 L",
    previousQty: "5 L",
    newQty: "15 L",
    purchaseRate: "₹145.00",
    date: "2026-11-05",
    dateTime: "05 Nov 2026, 11:15 AM",
    stockStatus: "Available",
    currentStock: "In Stock",
  },
  {
    id: 3,
    productName: "Wheat Flour",
    type: "Stock In",
    productType: "Raw Material",
    quantity: "5 kg",
    previousQty: "10 kg",
    newQty: "15 kg",
    purchaseRate: "₹38.00",
    date: "2026-11-04",
    dateTime: "04 Nov 2026, 02:20 PM",
    stockStatus: "Available",
    currentStock: "Low Stock",
  },
  {
    id: 4,
    productName: "Chicken Biryani",
    type: "Stock In",
    productType: "Finished Product",
    quantity: "12 Plates",
    previousQty: "8 Plates",
    newQty: "20 Plates",
    purchaseRate: "₹180.00",
    date: "2026-11-04",
    dateTime: "04 Nov 2026, 04:45 PM",
    stockStatus: "Available",
    currentStock: "In Stock",
  },
  {
    id: 5,
    productName: "Paneer",
    type: "Stock Out",
    productType: "Raw Material",
    quantity: "2 kg",
    previousQty: "3 kg",
    newQty: "5 kg",
    purchaseRate: "₹320.00",
    date: "2026-11-03",
    dateTime: "03 Nov 2026, 12:10 PM",
    stockStatus: "Available",
    currentStock: "Low Stock",
  },
  {
    id: 6,
    productName: "Chicken Curry",
    type: "Stock Out",
    productType: "Finished Product",
    quantity: "0 Plates",
    previousQty: "5 Plates",
    newQty: "5 Plates",
    purchaseRate: "₹160.00",
    date: "2026-11-03",
    dateTime: "03 Nov 2026, 01:30 PM",
    stockStatus: "Unavailable",
    currentStock: "Out of Stock",
  },
];

const emptyFilters = {
  startDate: "",
  endDate: "",
  transactionType: "All",
  dishName: "",
  lowStock: false,
};

function OutsourceMaterialReport() {
  const [filterInputs, setFilterInputs] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  const filtersRef = useRef(emptyFilters);

  filtersRef.current = appliedFilters;

  useEffect(() => {
    const tableElement = tableRef.current;
    const $ = window.jQuery;

    if (!$ || !tableElement) return;

    const filterFunction = (settings, data, dataIndex) => {
      if (settings.nTable !== tableElement) return true;

      const filters = filtersRef.current;
      const row = settings.aoData[dataIndex]?.nTr;

      if (!row) return true;

      const rowDate = row.dataset.date;
      const rowType = row.dataset.type;
      const rowProduct = row.dataset.product;
      const rowStock = row.dataset.stock;

      if (filters.startDate && rowDate < filters.startDate) {
        return false;
      }

      if (filters.endDate && rowDate > filters.endDate) {
        return false;
      }

      if (
        filters.transactionType !== "All" &&
        rowType !== filters.transactionType
      ) {
        return false;
      }

      if (filters.dishName && rowProduct !== filters.dishName) {
        return false;
      }

      if (
        filters.lowStock &&
        rowStock !== "Low Stock" &&
        rowStock !== "Out of Stock"
      ) {
        return false;
      }

      return true;
    };

    $.fn.dataTable.ext.search.push(filterFunction);

    const dataTable = $(tableElement).DataTable({
      scrollX: true,
      scrollCollapse: true,
      searching: true,
      paging: true,
      pageLength: 10,
      lengthChange: false,
      info: false,
      ordering: true,
      autoWidth: false,
      order: [],
      dom: "t",
    });

    dataTableRef.current = dataTable;

    return () => {
      $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
        (fn) => fn !== filterFunction,
      );

      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }

      dataTableRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.page
        .len(itemsPerPage === "All" ? -1 : Number(itemsPerPage))
        .draw();
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (dataTableRef.current) {
      dataTableRef.current.draw();
    }
  }, [appliedFilters]);

  const handleFilterChange = (field, value) => {
    setFilterInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filterInputs });
  };

  const resetFilters = () => {
    setFilterInputs(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const exportCSV = () => {
    const filteredData = transactions.filter((item) => {
      if (appliedFilters.startDate && item.date < appliedFilters.startDate) {
        return false;
      }

      if (appliedFilters.endDate && item.date > appliedFilters.endDate) {
        return false;
      }

      if (
        appliedFilters.transactionType !== "All" &&
        item.type !== appliedFilters.transactionType
      ) {
        return false;
      }

      if (
        appliedFilters.dishName &&
        item.productName !== appliedFilters.dishName
      ) {
        return false;
      }

      if (
        appliedFilters.lowStock &&
        item.currentStock !== "Low Stock" &&
        item.currentStock !== "Out of Stock"
      ) {
        return false;
      }

      return true;
    });

    const headers = [
      "Product Name",
      "Type",
      "Quantity",
      "Previous Qty",
      "New Qty",
      "Purchase Rate",
      "Date & Time",
      "Stock Status",
      "Current Stock",
    ];

    const rows = filteredData.map((item) => [
      item.productName,
      item.type,
      item.quantity,
      item.previousQty,
      item.newQty,
      item.purchaseRate,
      item.dateTime,
      item.stockStatus,
      item.currentStock,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "outsource-material-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5 className="mb-0">Outsource Material Transaction Report</h5>
                <p>All Outsource Material Transaction Report list</p>
              </div>
            </div>

            <div className="transection-report-filter">
              <div className="report-filter">
                <div>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterInputs.startDate}
                    max={filterInputs.endDate || undefined}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterInputs.endDate}
                    min={filterInputs.startDate || undefined}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select
                    value={filterInputs.transactionType}
                    onChange={(e) =>
                      handleFilterChange("transactionType", e.target.value)
                    }
                  >
                    <option value="All">All Type</option>
                    <option value="Stock In">Stock In</option>
                    <option value="Stock Out">Stock Out</option>
                  </Form.Select>
                </div>

                <div>
                  <Form.Label>Dish Name</Form.Label>
                  <Form.Select
                    value={filterInputs.dishName}
                    onChange={(e) =>
                      handleFilterChange("dishName", e.target.value)
                    }
                  >
                    <option value="">Select Dish</option>
                    {[
                      "Rice",
                      "Cooking Oil",
                      "Wheat Flour",
                      "Chicken Biryani",
                      "Paneer",
                      "Chicken Curry",
                    ].map((dish) => (
                      <option key={dish} value={dish}>
                        {dish}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div>
                  <Form.Label>Items Per Page</Form.Label>
                  <Form.Select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="All">All</option>
                  </Form.Select>
                </div>

                <div className="stock-switch">
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Show Low Stock Only"
                      checked={filterInputs.lowStock}
                      onChange={(e) =>
                        handleFilterChange("lowStock", e.target.checked)
                      }
                    />
                  </Form>
                </div>
              </div>

              <div className="filter-auto">
                <button
                  type="button"
                  className="action-btn add"
                  onClick={applyFilters}
                  title="Apply Filters"
                >
                  <FunnelPlus size={15} />
                </button>

                <button
                  type="button"
                  className="action-btn other"
                  onClick={resetFilters}
                  title="Reset Filters"
                >
                  <X size={15} />
                </button>

                <button
                  type="button"
                  className="action-btn delete"
                  onClick={exportCSV}
                  title="Export CSV"
                >
                  <FolderInput size={15} />
                </button>
              </div>
            </div>

            <Row className="g-2 mb-2 mt-2">
              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Col key={index} xs={6} lg={4} className="mb-1">
                    <div className="dashboard-stat-card material">
                      <div className="stat-card-top">
                        <span className="stat-title">{item.title}</span>

                        <span
                          className="stat-icon"
                          style={{
                            backgroundColor: item.bg,
                            color: item.color,
                            border: item.border,
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

            <div className="table-wrapper">
              <table
                ref={tableRef}
                className="display nowrap restaurant-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Previous Qty</th>
                    <th>New Qty</th>
                    <th>Purchase Rate</th>
                    <th>Date & Time</th>
                    <th>Stock Status</th>
                    <th>Current Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((item) => (
                    <tr
                      key={item.id}
                      data-date={item.date}
                      data-type={item.type}
                      data-product={item.productName}
                      data-stock={item.currentStock}
                    >
                      <td>{item.productName}</td>
                      <td>{item.productType}</td>
                      <td>{item.quantity}</td>
                      <td>{item.previousQty}</td>
                      <td>{item.newQty}</td>
                      <td>{item.purchaseRate}</td>
                      <td>{item.dateTime}</td>
                      <td>
                        <span
                          className={`stock-status ${
                            item.stockStatus === "Available"
                              ? "success"
                              : "denger"
                          }`}
                        >
                          {item.stockStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`stock-status ${
                            item.currentStock === "In Stock"
                              ? "success"
                              : "denger"
                          }`}
                        >
                          {item.currentStock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default OutsourceMaterialReport;
