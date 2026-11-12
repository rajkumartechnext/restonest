import React, { useState } from "react";
import Select from "react-select";
import Header from "../components/Header";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import QrCode from "../assets/images/qr-code.png";
import { PrinterCheck, ScanLine, ScanQrCode } from "lucide-react";

function GenerateQR() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [copies, setCopies] = useState(1);
  const [printAll, setPrintAll] = useState(false);
  const [columns, setColumns] = useState({
    value: "2",
    label: "2 per row",
  });
  const [paperSize, setPaperSize] = useState({
    value: "A4",
    label: "A4",
  });
  const [includeHeader, setIncludeHeader] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const options = [
    { value: "Table 1", label: "Table 1" },
    { value: "Table 2", label: "Table 2" },
    { value: "Table 3", label: "Table 3" },
    { value: "Table 4", label: "Table 4" },
    { value: "Table 5", label: "Table 5" },
  ];

  const columnOptions = [
    { value: "2", label: "2 per row" },
    { value: "3", label: "3 per row" },
    { value: "4", label: "4 per row" },
  ];

  const paperOptions = [
    { value: "A4", label: "A4" },
    { value: "A5", label: "A5" },
    { value: "Letter", label: "Letter" },
  ];

  const generateQrUrl = (tableName) => {
    const qrData = `Table: ${tableName}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  };

  const loadQrImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(url);
      image.onerror = () =>
        reject(new Error("QR code could not be generated."));

      image.src = url;
    });
  };

  const handleGenerate = async () => {
    setError("");

    const quantity = Number(copies);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      setError("Please enter a number of copies between 1 and 20.");
      return;
    }

    const tables = printAll
      ? options.map((item) => item.value)
      : selectedOptions.map((item) => item.value);

    if (tables.length === 0) {
      setError("Please select at least one table.");
      return;
    }

    const generatedList = tables.flatMap((tableName) =>
      Array.from({ length: quantity }, (_, index) => ({
        id: `${tableName}-${index}-${Date.now()}`,
        tableName,
        copy: index + 1,
        qrUrl: generateQrUrl(tableName),
      })),
    );

    setIsGenerating(true);

    try {
      await Promise.all(generatedList.map((item) => loadQrImage(item.qrUrl)));

      setQrCodes(generatedList);
    } catch (err) {
      setError("Unable to generate QR codes. Please try again.");
      setQrCodes([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    setSelectedOptions([]);
    setCopies(1);
    setPrintAll(false);
    setColumns(columnOptions[0]);
    setPaperSize(paperOptions[0]);
    setIncludeHeader(false);
    setQrCodes([]);
    setError("");
    setIsGenerating(false);
  };

  const handlePrint = () => {
    if (qrCodes.length === 0) {
      setError("Please generate QR codes before printing.");
      return;
    }

    window.print();
  };

  return (
    <>
      <div className="no-print">
        <Header />
      </div>

      <main className="restonest-dashboard">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header">
              <div className="no-print">
                <h5>Generate QR Codes</h5>
                <p>Monitor your restaurant sales performance</p>
              </div>

              <div className="sub-right align-items-center d-flex gap-3 mb-2 no-print">
                <h5 className="qr-header mb-0">
                  <div className="dot"></div>
                  Preview (Total: {qrCodes.length} codes)
                </h5>

                <Button
                  className="btn-print"
                  onClick={handlePrint}
                  disabled={qrCodes.length === 0 || isGenerating}
                  title="Print QR Codes"
                >
                  <PrinterCheck />
                </Button>
              </div>
            </div>

            <div className="my-form">
              <Row className="mb-3 align-items-center">
                <Col md={5} className="no-print">
                  <div className="qr-generation">
                    <h5 className="qr-header">
                      <div className="dot"></div>
                      Generation Options
                    </h5>

                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Number of QR copies</Form.Label>

                          <Form.Control
                            required
                            type="number"
                            min="1"
                            max="20"
                            value={copies}
                            onChange={(e) => setCopies(e.target.value)}
                            placeholder="0"
                          />

                          <small>copies to generate (1-20)</small>
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <div className="multi-select-wrapper">
                          <label className="form-label">Select Table</label>

                          <Select
                            isMulti
                            options={options}
                            value={selectedOptions}
                            onChange={(value) =>
                              setSelectedOptions(value || [])
                            }
                            placeholder="Select tables..."
                            closeMenuOnSelect={false}
                            isSearchable
                            isDisabled={printAll || isGenerating}
                            classNamePrefix="restonest-select"
                            menuPortalTarget={document.body}
                          />
                        </div>
                      </Col>
                    </Row>

                    <Form.Group className="mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Print All Table"
                        checked={printAll}
                        onChange={(e) => setPrintAll(e.target.checked)}
                        disabled={isGenerating}
                      />
                    </Form.Group>
                  </div>

                  <div className="qr-generation">
                    <Form.Group>
                      <Form.Label>Number of QR Codes</Form.Label>

                      <Select
                        options={columnOptions}
                        value={columns}
                        onChange={setColumns}
                        isSearchable={false}
                        classNamePrefix="restonest-select"
                        menuPortalTarget={document.body}
                      />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label>Paper Size</Form.Label>

                      <Select
                        options={paperOptions}
                        value={paperSize}
                        onChange={setPaperSize}
                        isSearchable={false}
                        classNamePrefix="restonest-select"
                        menuPortalTarget={document.body}
                      />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Include Hotel Header in Print"
                        checked={includeHeader}
                        onChange={(e) => setIncludeHeader(e.target.checked)}
                      />
                    </Form.Group>
                  </div>

                  {error && <div className="qr-error mb-3">{error}</div>}

                  <div className="d-flex gap-2 flex-wrap qr-action-buttons">
                    <Button
                      className="resto-cancel"
                      onClick={handleCancel}
                      disabled={isGenerating}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="resto-primary"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      Regenerate
                    </Button>

                    <Button
                      className="resto-secondary"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      Generate QR Codes
                    </Button>
                  </div>
                </Col>

                <Col
                  md={1}
                  className="d-flex justify-content-center align-items-center no-print"
                >
                  <div
                    className={`qr-loading ${isGenerating ? "is-loading" : ""}`}
                  >
                    <ScanLine size={25} />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="code-listing print-area">
                    {isGenerating ? (
                      <div className="qr-empty-state">
                        <div className="qr-loading-under is-loading-under">
                          <ScanQrCode size={25} />
                        </div>
                      </div>
                    ) : qrCodes.length > 0 ? (
                      <div
                        className="bar-code-gemeration"
                        style={{
                          "--print-columns": columns.value,
                        }}
                      >
                        {qrCodes.map((item) => (
                          <div className="ber-code" key={item.id}>
                            {includeHeader && qrCodes.length > 0 && (
                              <div className="qr-hotel-header">
                                <h4>My Food</h4>
                              </div>
                            )}
                            <img
                              src={item.qrUrl}
                              alt={`QR code for ${item.tableName}`}
                            />

                            <h5>{item.tableName}</h5>

                            <p>FOOD ORDER VIA QR CODE</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="qr-empty-state">
                        <img src={QrCode} alt="QR code preview" />
                        <h5>QR Code Preview</h5>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default GenerateQR;
