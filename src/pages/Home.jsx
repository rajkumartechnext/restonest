import React, { Activity, useState } from "react";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import Chart from "react-apexcharts";
import Form from "react-bootstrap/Form";

import {
  IndianRupee,
  Building2,
  UtensilsCrossed,
  FolderInput,
  Calendar,
  Hamburger,
  Wallet,
  HandCoins,
  TrendingUp,
  Minus,
} from "lucide-react";

const salesOptions = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
    fontFamily: "inherit",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "48%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },
  colors: ["#278a0e", "#83bd70", "#e5b65c"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#858c86",
        fontSize: "11px",
      },
    },
  },
  yaxis: {
    title: {
      text: "Sales (₹ thousands)",
      style: {
        color: "#858c86",
        fontSize: "11px",
        fontWeight: 400,
      },
    },
    labels: {
      style: {
        colors: "#858c86",
        fontSize: "11px",
      },
    },
  },
  grid: {
    borderColor: "#edf0ed",
    strokeDashArray: 4,
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "11px",
    markers: {
      radius: 10,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "₹ " + val + " thousand";
      },
    },
  },
};

const menuOptions = {
  chart: {
    type: "donut",
    height: 350,
    fontFamily: "inherit",
  },
  labels: ["Pizza", "Burger", "Pasta", "Biryani", "Drinks"],
  colors: ["#278a0e", "#83bd70", "#e5b65c", "#6685ad", "#d98d7d"],
  plotOptions: {
    pie: {
      borderRadius: 8,
      donut: {
        size: "65%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "12px",
            color: "#858c86",
            offsetY: -8,
          },
          value: {
            show: true,
            fontSize: "24px",
            fontWeight: 600,
            color: "#252a26",
            offsetY: 5,
            formatter: (val) => val,
          },
          total: {
            show: true,
            showAlways: true,
            label: "Total Orders",
            fontSize: "11px",
            color: "#858c86",
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            },
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "11px",
    markers: {
      radius: 10,
    },
    itemMargin: {
      horizontal: 8,
      vertical: 5,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} orders`,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          fontSize: "10px",
        },
      },
    },
  ],
};

const salesSeries = [
  {
    name: "Revenue",
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 120],
  },
  {
    name: "Net Sales",
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 72],
  },
  {
    name: "Profit",
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 58],
  },
];

const menuSeries = [44, 55, 41, 17, 15];

function Home() {
  const [selectedReport, setSelectedReport] = useState("stock");

  const reportData = {
    stock: {
      columns: ["Item Name", "Category", "Stock", "Unit", "Status"],
      rows: [
        ["Tomato", "Vegetables", "45", "Kg", "In Stock", "success"],
        ["Cheese", "Dairy", "8", "Kg", "Low Stock", "warning"],
        ["Cooking Oil", "Grocery", "25", "Ltr", "In Stock", "success"],
        ["Potato", "Vegetables", "3", "Kg", "Low Stock", "warning"],
      ],
    },

    purchase: {
      columns: ["Purchase ID", "Supplier", "Date", "Amount", "Status"],
      rows: [
        [
          "PUR-1001",
          "Fresh Foods",
          "30 Oct 2026",
          "₹ 5,500",
          "Received",
          "success",
        ],
        [
          "PUR-1002",
          "Daily Dairy",
          "29 Oct 2026",
          "₹ 3,200",
          "Pending",
          "pending",
        ],
        [
          "PUR-1003",
          "Food Mart",
          "28 Oct 2026",
          "₹ 7,800",
          "Received",
          "success",
        ],
      ],
    },

    order: {
      columns: [
        "Order ID",
        "Supplier",
        "Order Date",
        "Delivery Date",
        "Status",
      ],
      rows: [
        [
          "PO-2001",
          "Fresh Foods",
          "28 Oct 2026",
          "31 Oct 2026",
          "Pending",
          "pending",
        ],
        [
          "PO-2002",
          "Daily Dairy",
          "27 Oct 2026",
          "29 Oct 2026",
          "Completed",
          "success",
        ],
        [
          "PO-2003",
          "Food Mart",
          "26 Oct 2026",
          "30 Oct 2026",
          "Pending",
          "pending",
        ],
      ],
    },

    summary: {
      columns: ["Month", "Total Orders", "Received", "Pending", "Total Amount"],
      rows: [
        ["October", "25", "20", "5", "₹ 45,500"],
        ["September", "32", "30", "2", "₹ 58,200"],
        ["August", "18", "16", "2", "₹ 36,800"],
      ],
    },
  };

  const stats = [
    {
      title: "Total Sales",
      count: "12",
      icon: IndianRupee,
      color: "#57976a",
      bg: "#edf6ef",
    },
    {
      title: "Total Orders",
      count: "5",
      icon: Hamburger,
      color: "#6685ad",
      bg: "#eff3f8",
    },
    {
      title: "Companies",
      count: "25",
      icon: Building2,
      color: "#d9a36d",
      bg: "#fbf4eb",
    },
    {
      title: "Menus",
      count: "4",
      icon: UtensilsCrossed,
      color: "#d98d7d",
      bg: "#fcf1ef",
    },
  ];

  return (
    <>
      <Header />

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-heading">
            <div className="sub-heading">
              <h3>Welcome Restonest</h3>
              <p>Welcome back, KYS! Here's what's happening today.</p>
            </div>
            <div className="sub-right d-flex gap-2">
              <button className="btn-normal">
                <Calendar size={15} /> This Week
              </button>
              <button className="btn-secondary">
                <FolderInput size={15} /> Import
              </button>
            </div>
          </div>

          <section className="dashboard-stats">
            <Row className="g-2">
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

              <Col lg={8}>
                <div className="dashboard-stat-card">
                  <div className="sales-overview-header">
                    <div>
                      <h5>Sales Overview</h5>
                      <p>Monitor your restaurant sales performance</p>
                    </div>

                    <Form.Select>
                      <option>This Year</option>
                      <option>This Month</option>
                      <option>This Week</option>
                    </Form.Select>
                  </div>

                  <Chart
                    options={salesOptions}
                    series={salesSeries}
                    type="bar"
                    height={350}
                    width="100%"
                  />
                </div>
              </Col>

              <Col lg={4}>
                <div className="dashboard-stat-card">
                  <div className="sales-overview-header">
                    <div>
                      <h5>Top Menu Items</h5>
                      <p>Most popular items by orders</p>
                    </div>

                    <Form.Select>
                      <option>This Month</option>
                      <option>This Week</option>
                      <option>This Year</option>
                    </Form.Select>
                  </div>

                  <Chart
                    options={menuOptions}
                    series={menuSeries}
                    type="donut"
                    height={350}
                    width="100%"
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="dashboard-stat-card">
                  <div className="sales-overview-header">
                    <div>
                      <h5>Inventory Reports</h5>
                      <p>Manage your stock and purchase reports</p>
                    </div>

                    <Form.Select
                      value={selectedReport}
                      onChange={(e) => setSelectedReport(e.target.value)}
                    >
                      <option value="stock">Current Stock Report</option>
                      <option value="purchase">Current Purchase Report</option>
                      <option value="order">Purchase Order Report</option>
                      <option value="summary">Purchase Summary Report</option>
                    </Form.Select>
                  </div>

                  <div className="my-table table-responsive">
                    <table className="table report-table">
                      <thead>
                        <tr>
                          {reportData[selectedReport].columns.map(
                            (column, index) => (
                              <th key={index}>{column}</th>
                            ),
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {reportData[selectedReport].rows.map(
                          (row, rowIndex) => (
                            <tr key={rowIndex}>
                              {selectedReport === "summary" ? (
                                row.map((cell, cellIndex) => (
                                  <td key={cellIndex}>{cell}</td>
                                ))
                              ) : (
                                <>
                                  {row.slice(0, -2).map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                  ))}

                                  <td>
                                    <span
                                      className={`stock-status ${row[row.length - 1]}`}
                                    >
                                      {row[row.length - 2]}
                                    </span>
                                  </td>
                                </>
                              )}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <div className="dashboard-stat-card">
                  <div className="sales-overview-header">
                    <div>
                      <h5>Profit & Loss</h5>
                      <p>Track your restaurant's financial performance</p>
                    </div>
                  </div>

                  <div className="financial-summary">
                    <Row className="g-3">
                      <Col xs={5}>
                        <div className="financial-card revenue-card">
                          <div className="financial-icon">
                            <Wallet size={17} />
                          </div>
                          <div className="financial-content">
                            <span>Revenue</span>
                            <h5>₹24,09,555</h5>
                            <small className="financial-growth positive">
                              <TrendingUp size={12} /> 12.5%
                            </small>
                          </div>
                        </div>
                      </Col>

                      <Col
                        xs={2}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <div className="financial-minus">
                          <Minus size={13} />
                        </div>
                      </Col>

                      <Col xs={5}>
                        <div className="financial-card expense-card">
                          <div className="financial-icon">
                            <HandCoins size={17} />
                          </div>
                          <div className="financial-content">
                            <span>Expense</span>
                            <h5>₹12,09,555</h5>
                            <small className="financial-growth negative">
                              <TrendingUp size={12} /> 5.2%
                            </small>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12}>
                        <div className="financial-card profit-card">
                          <div className="financial-icon">
                            <TrendingUp size={17} />
                          </div>
                          <div className="financial-content">
                            <span>Net Profit</span>
                            <h5>₹12,00,000</h5>
                            <small className="financial-growth positive">
                              <TrendingUp size={12} /> 18.8% compared to last
                              month
                            </small>
                          </div>
                          <div className="profit-margin">
                            <span>Profit Margin</span>
                            <strong>49.8%</strong>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </section>
        </Container>
      </main>
    </>
  );
}

export default Home;
