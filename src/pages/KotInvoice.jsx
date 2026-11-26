import React from "react";
import { Printer } from "lucide-react";

function KotInvoice() {
  const items = [
    { id: 1, name: "Chicken Reshmi Kebab", qty: 2 },
    { id: 2, name: "Paneer Tikka", qty: 1 },
    { id: 3, name: "Chicken Biryani", qty: 3 },
    { id: 4, name: "Butter Naan", qty: 4 },
  ];

  return (
    <>
      <style>{`
        .kot-wrapper {
          padding: 30px;
          background: #f5f5f5;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .kot-bill {
         max-width: 340px;
    margin: auto;
    padding: 14px;
    background: #fff;
    border: 1px solid #ddd;
    color: #222;
        }

        .kot-heading {
          text-align: center;
          border-bottom: 1px dashed #999;
          padding-bottom: 8px;
        }

        .kot-heading h3 {
              margin: 0;
    font-size: 13px;
    font-weight: 700;
        }

        .kot-heading h4 {
          margin: 5px 0 0;
    font-size: 10px;
        }

        .kot-info {
          padding: 4px 0;
    border-bottom: 1px dashed #999;
    font-size: 12px;
        }

        .kot-info p {
          display: flex;
    justify-content: space-between;
    margin: 4px 0;
        }

        .kot-table {
          width: 100%;
          border-collapse: collapse;
        }

        .kot-table th,
        .kot-table td {
             padding: 5px 2px;
    border-bottom: 1px solid #eee;
    text-align: left;
    font-size: 12px;
        }

        .kot-table th:last-child,
        .kot-table td:last-child {
          text-align: center;
        }

        .kot-footer {
              text-align: center;
    padding-top: 8px;
    font-size: 12px;
    font-weight: 600;
        }

        .kot-print-btn {
              display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 20px auto 0;
    padding: 6px 20px;
    background: #278a0e;
    font-size: 15px;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
        }

        @media print {
          @page {
            size: 80mm auto;
            margin: 3mm;
          }

          body {
            background: #fff;
          }

          .kot-wrapper {
            padding: 0;
            background: #fff;
            min-height: auto;
          }

          .kot-bill {
            width: 100%;
            max-width: none;
            padding: 5px;
            border: none;
          }

          .kot-print-btn {
            display: none;
          }
        }
          @media print {
  @page {
    size: 80mm auto;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  .kot-wrapper {
    width: 340px;
    min-height: auto;
    padding: 0;
    margin: 0 auto;
    margin-top: 15px;
    background: #fff;
  }

  .kot-bill {
    width: 340px;
    max-width: 340px;
    padding: 14px;
    margin: 0;
    border: 1px solid #ddd;
  }
.kot-info p {
    margin: 0;
}
    .kot-table th, .kot-table td {
    padding: 2px 2px;
}
  .kot-print-btn {
    display: none !important;
  }
    .kot-footer p {
    margin: 0;
}
    .kot-heading {
    padding-bottom: 2px;
}
    .kot-heading h4 {
    margin: 0;
    font-size: 9px;
}
}
      `}</style>

      <div className="kot-wrapper">
        <div className="kot-bill">
          <div className="kot-heading">
            <h3>RESTONEST RESTAURANT</h3>
            <h4>KITCHEN ORDER TICKET</h4>
          </div>

          <div className="kot-info">
            <p>
              <span>KOT No:</span> <strong>KOT-00125</strong>
            </p>
            <p>
              <span>Order No:</span> <strong>ORD-00248</strong>
            </p>
            <p>
              <span>Date:</span> <strong>26-11-2026</strong>
            </p>
            <p>
              <span>Table:</span> <strong>Table 05</strong>
            </p>
            <p>
              <span>Waiter:</span> <strong>Rahul</strong>
            </p>
          </div>

          <table className="kot-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Qty</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <strong>{item.qty}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="kot-footer">
            <p className="mb-0">
              Total Items: {items.reduce((total, item) => total + item.qty, 0)}
            </p>
            <p>------ Thank You ------</p>
          </div>
        </div>

        <button className="kot-print-btn" onClick={() => window.print()}>
          <Printer size={16} /> Print KOT
        </button>
      </div>
    </>
  );
}

export default KotInvoice;
