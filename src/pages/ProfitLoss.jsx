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
  IndianRupee,
  Banknote,
  HandCoins,
  BadgePercent,
} from "lucide-react";
import Header from "../components/Header";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const stats = [
  {
    title: "Total Cost",
    count: "61,940.00",
    icon: IndianRupee,
    color: "#57976a",
    bg: "#cef3d6",
    border: "1px solid #57976a",
  },
  {
    title: "Total Sales",
    count: "4,088.00",
    icon: Banknote,
    color: "#6685ad",
    bg: "#dde8f7",
    border: "1px solid #6685ad",
  },
  {
    title: "Total Profit",
    count: "-57,852.00",
    icon: HandCoins,
    color: "#d9a36d",
    bg: "#ffebd2",
    border: "1px solid #d9a36d",
  },
  {
    title: "Profit Margin",
    count: "-1,743.00",
    icon: BadgePercent,
    color: "#dc5353",
    bg: "#fde8e8",
    border: "1px solid #ebb4b4",
  },
];

const transactions = [
  {
    id: 1,
    name: "WATER (1LT)",
    stockOut: "2272",
    rate: 20,
    totalCost: 45440,
    date: "2026-10-06",
    materialType: "Outsource Products Usage",
  },
  {
    id: 2,
    name: "Rice",
    stockOut: "120",
    rate: 52,
    totalCost: 6240,
    date: "2026-10-07",
    materialType: "Kitchen Materials Usage",
  },
  {
    id: 3,
    name: "Cooking Oil",
    stockOut: "25",
    rate: 145,
    totalCost: 3625,
    date: "2026-10-08",
    materialType: "Kitchen Materials Usage",
  },
  {
    id: 4,
    name: "Chicken",
    stockOut: "35",
    rate: 220,
    totalCost: 7700,
    date: "2026-10-09",
    materialType: "Kitchen Materials Usage",
  },
  {
    id: 5,
    name: "Cold Drinks",
    stockOut: "150",
    rate: 35,
    totalCost: 5250,
    date: "2026-10-10",
    materialType: "Outsource Products Usage",
  },
  {
    id: 6,
    name: "Wheat Flour",
    stockOut: "40",
    rate: 38,
    totalCost: 1520,
    date: "2026-10-11",
    materialType: "Kitchen Materials Usage",
  },
  {
    id: 7,
    name: "Mineral Water",
    stockOut: "300",
    rate: 15,
    totalCost: 4500,
    date: "2026-10-12",
    materialType: "Outsource Products Usage",
  },
  {
    id: 8,
    name: "Paneer",
    stockOut: "15",
    rate: 320,
    totalCost: 4800,
    date: "2026-10-13",
    materialType: "Kitchen Materials Usage",
  },
];

const emptyFilters = {
  startDate: "",
  endDate: "",
  materialType: "All",
};

function ProfitLoss() {
  const [filterInputs, setFilterInputs] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

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
      const rowMaterial = row.dataset.material;

      if (filters.startDate && rowDate < filters.startDate) {
        return false;
      }

      if (filters.endDate && rowDate > filters.endDate) {
        return false;
      }

      if (
        filters.materialType !== "All" &&
        rowMaterial !== filters.materialType
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
      paging: false,
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

    if (dataTableRef.current) {
      dataTableRef.current.search("").order([]).draw();
    }
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
        appliedFilters.materialType !== "All" &&
        item.materialType !== appliedFilters.materialType
      ) {
        return false;
      }

      return true;
    });

    const headers = [
      "SL.NO",
      "Name",
      "Stock Out",
      "Rate",
      "Total Cost",
      "Date",
    ];

    const rows = filteredData.map((item, index) => [
      String(index + 1).padStart(2, "0"),
      item.name,
      item.stockOut,
      `₹${item.rate.toFixed(2)}`,
      `₹${item.totalCost.toFixed(2)}`,
      item.date,
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
    link.download = "profit-loss-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div>
                <h5 className="mb-0">Profit & Loss Report</h5>
                <p>
                  View your total revenue, expenses, and net profit summary.
                </p>
              </div>
            </div>

            <div className="transection-report-filter">
              <div className="report-filter profit-loss">
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
                  <Form.Label>Material Type</Form.Label>
                  <Form.Select
                    value={filterInputs.materialType}
                    onChange={(e) =>
                      handleFilterChange("materialType", e.target.value)
                    }
                  >
                    <option value="All">All Materials</option>
                    <option value="Kitchen Materials Usage">
                      Kitchen Materials Usage
                    </option>
                    <option value="Outsource Products Usage">
                      Outsource Products Usage
                    </option>
                  </Form.Select>
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
                  <Col key={index} xs={6} lg={3} className="mb-1">
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
                    <th>SL.NO</th>
                    <th>Name</th>
                    <th>Stock Out</th>
                    <th>Rate</th>
                    <th>Total Cost</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((item, index) => (
                    <tr
                      key={item.id}
                      data-date={item.date}
                      data-material={item.materialType}
                    >
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <td>{item.name}</td>
                      <td>{item.stockOut}</td>
                      <td>₹{item.rate.toFixed(2)}</td>
                      <td>
                        ₹
                        {item.totalCost.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{item.date}</td>
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

export default ProfitLoss;
