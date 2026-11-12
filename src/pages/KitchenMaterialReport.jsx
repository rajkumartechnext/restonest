import { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-fixedcolumns";
import "datatables.net-fixedcolumns-dt";
import "datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css";
import { X, FunnelPlus, FolderInput } from "lucide-react";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const emptyForm = {
  companyName: "",
  gstNumber: "",
  phone: "",
};

const initialTransactions = [
  {
    id: "01",
    material: "Rice",
    materialId: "COM455",
    volume: "5",
    type: "kg",
    transactionType: "Credit",
    purchaseRate: "₹52.00",
    reference: "PO-2026-001",
    date: "2026-11-05",
    createdAt: "05 Nov 2026, 10:30 AM",
  },
  {
    id: "02",
    material: "Cooking Oil",
    materialId: "COM456",
    volume: "10",
    type: "litre",
    transactionType: "Credit",
    purchaseRate: "₹145.00",
    reference: "PO-2026-002",
    date: "2026-11-05",
    createdAt: "05 Nov 2026, 11:15 AM",
  },
  {
    id: "03",
    material: "Wheat Flour",
    materialId: "COM457",
    volume: "25",
    type: "kg",
    transactionType: "Debit",
    purchaseRate: "₹38.00",
    reference: "PO-2026-003",
    date: "2026-11-04",
    createdAt: "04 Nov 2026, 02:20 PM",
  },
  {
    id: "04",
    material: "Sugar",
    materialId: "COM458",
    volume: "10",
    type: "kg",
    transactionType: "Credit",
    purchaseRate: "₹45.00",
    reference: "PO-2026-004",
    date: "2026-11-04",
    createdAt: "04 Nov 2026, 04:45 PM",
  },
  {
    id: "05",
    material: "Salt",
    materialId: "COM459",
    volume: "5",
    type: "kg",
    transactionType: "Debit",
    purchaseRate: "₹22.00",
    reference: "PO-2026-005",
    date: "2026-11-03",
    createdAt: "03 Nov 2026, 12:10 PM",
  },
  {
    id: "06",
    material: "Potato",
    materialId: "COM460",
    volume: "20",
    type: "kg",
    transactionType: "Credit",
    purchaseRate: "₹28.00",
    reference: "PO-2026-006",
    date: "2026-11-03",
    createdAt: "03 Nov 2026, 01:30 PM",
  },
];

const emptyFilters = {
  startDate: "",
  endDate: "",
  transactionType: "",
  materialName: "",
  reference: "",
  purchaseRate: "",
};

function KitchenMaterialReport() {
  const [formData, setFormData] = useState(emptyForm);
  const [editingRow, setEditingRow] = useState(null);

  const [previewImage, setPreviewImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

  const tableRef = useRef(null);
  const fileInputRef = useRef(null);
  const appliedFiltersRef = useRef(emptyFilters);

  useEffect(() => {
    const tableElement = tableRef.current;
    const $ = window.jQuery;

    if (!$ || !tableElement) return;

    const table = $(tableElement);

    const customFilter = (settings, data, dataIndex) => {
      if (settings.nTable !== tableElement) return true;

      const currentFilters = appliedFiltersRef.current;
      const row = settings.aoData[dataIndex]?.nTr;

      if (!row) return true;

      const transactionDate = row.dataset.date || "";
      const transactionType = row.dataset.transactionType || "";

      const materialName = data[1]?.toLowerCase() || "";
      const purchaseRate = data[4]?.toLowerCase() || "";
      const reference = data[5]?.toLowerCase() || "";

      if (
        currentFilters.startDate &&
        transactionDate < currentFilters.startDate
      ) {
        return false;
      }

      if (currentFilters.endDate && transactionDate > currentFilters.endDate) {
        return false;
      }

      if (
        currentFilters.transactionType &&
        transactionType.toLowerCase() !==
          currentFilters.transactionType.toLowerCase()
      ) {
        return false;
      }

      if (
        currentFilters.materialName &&
        !materialName.includes(currentFilters.materialName.toLowerCase())
      ) {
        return false;
      }

      if (
        currentFilters.reference &&
        !reference.includes(currentFilters.reference.toLowerCase())
      ) {
        return false;
      }

      if (
        currentFilters.purchaseRate &&
        !purchaseRate.includes(currentFilters.purchaseRate.toLowerCase())
      ) {
        return false;
      }

      return true;
    };

    $.fn.dataTable.ext.search.push(customFilter);

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

      $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
        (filter) => filter !== customFilter,
      );

      if ($.fn.DataTable.isDataTable(tableElement)) {
        dataTable.destroy();
      }
    };
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    appliedFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });

    if (
      window.jQuery &&
      window.jQuery.fn.DataTable.isDataTable(tableRef.current)
    ) {
      window.jQuery(tableRef.current).DataTable().draw();
    }
  };

  const handleClearFilter = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    appliedFiltersRef.current = emptyFilters;

    if (
      window.jQuery &&
      window.jQuery.fn.DataTable.isDataTable(tableRef.current)
    ) {
      window.jQuery(tableRef.current).DataTable().draw();
    }
  };

  const handleExport = () => {
    const dataTable = window.jQuery(tableRef.current).DataTable();
    const rows = dataTable.rows({ search: "applied" }).nodes().toArray();

    const headers = [
      "ID",
      "Material",
      "Volume",
      "Unit",
      "Purchase Rate",
      "Reference",
      "Created At",
    ];

    const csvRows = rows.map((row) =>
      Array.from(row.cells).map(
        (cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`,
      ),
    );

    const csvContent = [
      headers.map((header) => `"${header}"`).join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "material-transaction-report.csv";
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
                <h5 className="mb-0">Material Transaction Report</h5>
                <p>All Material Transaction Report list</p>
              </div>
            </div>

            <div className="transection-report-filter">
              <div className="report-filter">
                <div>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.startDate}
                    max={filters.endDate || undefined}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.endDate}
                    min={filters.startDate || undefined}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Form.Label>Product</Form.Label>
                  <Form.Select
                    value={filters.transactionType}
                    onChange={(e) =>
                      handleFilterChange("transactionType", e.target.value)
                    }
                  >
                    <option value="">Transaction Type</option>
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                  </Form.Select>
                </div>

                <div>
                  <Form.Label>Material Name</Form.Label>
                  <Form.Select
                    value={filters.materialName}
                    onChange={(e) =>
                      handleFilterChange("materialName", e.target.value)
                    }
                  >
                    <option value="">Select Material</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat Flour">Wheat Flour</option>
                    <option value="Cooking Oil">Cooking Oil</option>
                    <option value="Salt">Salt</option>
                    <option value="Sugar">Sugar</option>
                    <option value="Potato">Potato</option>
                    <option value="Onion">Onion</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Paneer">Paneer</option>
                    <option value="Milk">Milk</option>
                    <option value="Butter">Butter</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Egg">Egg</option>
                    <option value="Ginger">Ginger</option>
                    <option value="Garlic">Garlic</option>
                    <option value="Green Chilli">Green Chilli</option>
                    <option value="Turmeric Powder">Turmeric Powder</option>
                    <option value="Red Chilli Powder">Red Chilli Powder</option>
                    <option value="Garam Masala">Garam Masala</option>
                  </Form.Select>
                </div>

                <div>
                  <Form.Label>Transaction Reference</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Reference"
                    value={filters.reference}
                    onChange={(e) =>
                      handleFilterChange("reference", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Form.Label>Purchase Rate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Rate"
                    value={filters.purchaseRate}
                    onChange={(e) =>
                      handleFilterChange("purchaseRate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="filter-auto">
                <button
                  type="button"
                  className="action-btn add"
                  onClick={handleApplyFilter}
                  title="Apply Filter"
                >
                  <FunnelPlus size={15} />
                </button>

                <button
                  type="button"
                  className="action-btn other"
                  onClick={handleClearFilter}
                  title="Clear Filter"
                >
                  <X size={15} />
                </button>

                <button
                  type="button"
                  className="action-btn delete"
                  onClick={handleExport}
                  title="Export CSV"
                >
                  <FolderInput size={15} />
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
                    <th>Material (ID)</th>
                    <th>Volume</th>
                    <th>Type</th>
                    <th>Purchase Rate</th>
                    <th>Reference</th>
                    <th>Created At</th>
                  </tr>
                </thead>

                <tbody>
                  {initialTransactions.map((item) => (
                    <tr
                      key={item.id}
                      data-date={item.date}
                      data-transaction-type={item.transactionType}
                    >
                      <td>{item.id}</td>
                      <td>
                        {item.material} ({item.materialId})
                      </td>
                      <td>{item.volume}</td>
                      <td>{item.type}</td>
                      <td>{item.purchaseRate}</td>
                      <td>{item.reference}</td>
                      <td>{item.createdAt}</td>
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

export default KitchenMaterialReport;
