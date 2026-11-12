import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  CloudUpload,
  Plus,
  X,
} from "lucide-react";
import logo from "../assets/images/logo.png";

const PASSWORD_KEY = "restonest_current_password";
const BUSINESS_KEY = "restonest_business_info";
const INVOICE_KEY = "restonest_invoice_settings";
const INITIAL_PASSWORD = "admin123";

const defaultBusiness = {
  name: "Restonest",
  gst: "19BKPPG7135P3Z3",
  hsn: "996331",
  address:
    "Bengal Ambuja St, Urbashi Phase - 2, City Center, Durgapur, West Bengal 713216",
};

const defaultInvoice = {
  showBusinessName: true,
  showGST: true,
  showAddress: true,
  showLogo: true,
};

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function Settings() {
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  const [business, setBusiness] = useState(() =>
    readStorage(BUSINESS_KEY, defaultBusiness),
  );

  const [previewImage, setPreviewImage] = useState(
    () => readStorage(BUSINESS_KEY, defaultBusiness).logo || "",
  );

  const [isDragging, setIsDragging] = useState(false);

  const [invoice, setInvoice] = useState(() =>
    readStorage(INVOICE_KEY, defaultInvoice),
  );

  const [businessMessage, setBusinessMessage] = useState({
    type: "",
    text: "",
  });

  const [invoiceMessage, setInvoiceMessage] = useState({
    type: "",
    text: "",
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage({ type: "", text: "" });
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;

    setBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));

    setBusinessMessage({ type: "", text: "" });
  };

  const handleInvoiceChange = (e) => {
    const { name, checked } = e.target;

    setInvoice((prev) => ({
      ...prev,
      [name]: checked,
    }));

    setInvoiceMessage({ type: "", text: "" });
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setBusinessMessage({
        type: "error",
        text: "Please upload PNG, JPG, JPEG or WEBP image.",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setBusinessMessage({
        type: "error",
        text: "Image size must be less than 2MB.",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
        setBusinessMessage({
          type: "success",
          text: "Logo uploaded successfully. Click Save Business Information to save it.",
        });
      }
    };

    reader.onerror = () => {
      setBusinessMessage({
        type: "error",
        text: "Unable to upload image. Please try again.",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setBusinessMessage({
      type: "",
      text: "",
    });
  };

  const passwordStrength = () => {
    const password = passwords.new;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = passwordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (passwords.new.length < 8) {
      setMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (passwords.new === passwords.current) {
      setMessage({
        type: "error",
        text: "New password must be different from current password.",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const savedPassword =
        localStorage.getItem(PASSWORD_KEY) || INITIAL_PASSWORD;

      if (passwords.current !== savedPassword) {
        setMessage({
          type: "error",
          text: "Your current password is incorrect.",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem(PASSWORD_KEY, passwords.new);

      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });

      setMessage({
        type: "success",
        text: "Your password has been updated successfully.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Unable to update password. Please try again.",
      });
    }

    setLoading(false);
  };

  const handleClear = () => {
    setPasswords({
      current: "",
      new: "",
      confirm: "",
    });

    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });

    setMessage({ type: "", text: "" });
  };

  const handleBusinessSave = (e) => {
    e.preventDefault();

    if (
      !business.name.trim() ||
      !business.gst.trim() ||
      !business.hsn.trim() ||
      !business.address.trim()
    ) {
      setBusinessMessage({
        type: "error",
        text: "Please fill in all business information fields.",
      });
      return;
    }

    try {
      localStorage.setItem(
        BUSINESS_KEY,
        JSON.stringify({
          ...business,
          logo: previewImage,
        }),
      );

      setBusinessMessage({
        type: "success",
        text: "Business information saved successfully.",
      });
    } catch {
      setBusinessMessage({
        type: "error",
        text: "Unable to save business information.",
      });
    }
  };

  const handleInvoiceSave = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem(INVOICE_KEY, JSON.stringify(invoice));

      setInvoiceMessage({
        type: "success",
        text: "Invoice settings saved successfully.",
      });
    } catch {
      setInvoiceMessage({
        type: "error",
        text: "Unable to save invoice settings.",
      });
    }
  };

  const renderPasswordField = (label, name, placeholder) => (
    <Form.Group className="settings-form-group">
      <Form.Label>{label}</Form.Label>

      <div className="settings-password-input">
        <span className="settings-input-icon">
          <LockKeyhole size={17} />
        </span>

        <Form.Control
          type={showPassword[name] ? "text" : "password"}
          name={name}
          value={passwords[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
        />

        <button
          type="button"
          className="settings-password-toggle"
          onClick={() => togglePassword(name)}
          aria-label={showPassword[name] ? "Hide password" : "Show password"}
        >
          {showPassword[name] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Form.Group>
  );

  return (
    <div>
      <Header />

      <main className="restonest-dashboard settings-page">
        <Container fluid>
          <div className="dashboard-stat-card">
            <div className="sales-overview-header mb-3">
              <div>
                <h5 className="mb-0">Application Settings</h5>
                <p>Manage your application preferences and configurations</p>
              </div>
            </div>

            <Row className="g-3">
              <Col lg={4}>
                <div className="settings-security-card">
                  <div className="company-profile text-center mb-4">
                    <img src={logo} alt="" />
                    <h5>Restonest Cafe</h5>
                    <p className="mb-0">
                      Bengal Ambuja St, Urbashi Phase - 2, City Center,
                      Durgapur, West Bengal 713216
                    </p>
                  </div>

                  <h6>Password Security</h6>
                  <p>
                    Keep your account protected by using a strong and unique
                    password.
                  </p>

                  <h6 className="mb-3">Security Tips</h6>

                  <ul className="settings-security-list">
                    <li>
                      <CheckCircle2 size={16} />
                      Use at least 8 characters.
                    </li>

                    <li>
                      <CheckCircle2 size={16} />
                      Include uppercase and lowercase letters.
                    </li>

                    <li>
                      <CheckCircle2 size={16} />
                      Add numbers and special characters.
                    </li>

                    <li>
                      <CheckCircle2 size={16} />
                      Avoid using easily guessed passwords.
                    </li>
                  </ul>
                </div>
              </Col>

              <Col lg={8}>
                <div className="settings-password-card">
                  <div className="settings-form-heading">
                    <h5 className="qr-header">
                      <div className="dot"></div>
                      Update Your Password
                    </h5>
                  </div>

                  {message.text && (
                    <div
                      className={`settings-alert ${message.type}`}
                      role="alert"
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}

                      <span>{message.text}</span>
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {renderPasswordField(
                      "Current Password",
                      "current",
                      "Enter current password",
                    )}

                    {renderPasswordField(
                      "New Password",
                      "new",
                      "Enter new password",
                    )}

                    {passwords.new && (
                      <div className="settings-strength">
                        <div className="settings-strength-header">
                          <span>Password Strength</span>

                          <span
                            className={
                              strength <= 2
                                ? "weak"
                                : strength <= 3
                                  ? "medium"
                                  : "strong"
                            }
                          >
                            {strength <= 2
                              ? "Weak"
                              : strength <= 3
                                ? "Medium"
                                : "Strong"}
                          </span>
                        </div>

                        <div className="settings-strength-bars">
                          {[1, 2, 3, 4, 5].map((bar) => (
                            <span
                              key={bar}
                              className={
                                bar <= strength
                                  ? strength <= 2
                                    ? "active weak"
                                    : strength <= 3
                                      ? "active medium"
                                      : "active strong"
                                  : ""
                              }
                            ></span>
                          ))}
                        </div>
                      </div>
                    )}

                    {renderPasswordField(
                      "Confirm New Password",
                      "confirm",
                      "Re-enter new password",
                    )}

                    {passwords.confirm && (
                      <div
                        className={`settings-match ${
                          passwords.new === passwords.confirm
                            ? "matched"
                            : "not-matched"
                        }`}
                      >
                        {passwords.new === passwords.confirm ? (
                          <>
                            <CheckCircle2 size={15} />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <AlertCircle size={15} />
                            Passwords do not match
                          </>
                        )}
                      </div>
                    )}

                    <div className="settings-form-actions">
                      <button
                        type="button"
                        className="resto-cancel"
                        onClick={handleClear}
                      >
                        Clear
                      </button>

                      <button
                        type="submit"
                        className="resto-primary"
                        disabled={loading}
                      >
                        <LockKeyhole size={16} />
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </Form>
                </div>

                <div className="settings-password-card">
                  <div className="settings-form-heading">
                    <h5 className="qr-header">
                      <div className="dot"></div>
                      Business Information
                    </h5>
                  </div>

                  {businessMessage.text && (
                    <div
                      className={`settings-alert ${businessMessage.type}`}
                      role="alert"
                    >
                      {businessMessage.type === "success" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      <span>{businessMessage.text}</span>
                    </div>
                  )}

                  <Form onSubmit={handleBusinessSave}>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Business Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={business.name}
                            onChange={handleBusinessChange}
                            placeholder="Enter business name"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>GST Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="gst"
                            value={business.gst}
                            onChange={handleBusinessChange}
                            placeholder="Enter GST number"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>HSN Code (Default)</Form.Label>
                          <Form.Control
                            type="text"
                            name="hsn"
                            value={business.hsn}
                            onChange={handleBusinessChange}
                            placeholder="Enter HSN code"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Business Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="address"
                            value={business.address}
                            onChange={handleBusinessChange}
                            placeholder="Enter business address"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div
                      className={`pos-food-item upload-box ${
                        isDragging ? "drag-active" : ""
                      } ${previewImage ? "has-image" : ""}`}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (!previewImage) {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={(event) => {
                          handleImageUpload(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />

                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            alt="Business Logo"
                            className="upload-preview"
                          />

                          <button
                            type="button"
                            className="upload-remove"
                            aria-label="Remove logo"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRemoveImage();
                            }}
                          >
                            <X size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <Plus size={15} /> Change Image
                          </button>
                        </>
                      ) : (
                        <>
                          <CloudUpload size={30} />

                          <h5>Upload Logo</h5>

                          <small>Drag and drop your logo here</small>

                          <small>PNG, JPG, JPEG, WEBP (Max 2MB)</small>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <Plus size={15} /> Upload Logo
                          </button>
                        </>
                      )}
                    </div>

                    <div className="settings-form-actions">
                      <button type="submit" className="resto-primary">
                        <Save size={16} />
                        Save Business Information
                      </button>
                    </div>
                  </Form>
                </div>

                <div className="settings-password-card">
                  <div className="settings-form-heading">
                    <h5 className="qr-header">
                      <div className="dot"></div>
                      Invoice Settings
                    </h5>
                  </div>

                  {invoiceMessage.text && (
                    <div
                      className={`settings-alert ${invoiceMessage.type}`}
                      role="alert"
                    >
                      {invoiceMessage.type === "success" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      <span>{invoiceMessage.text}</span>
                    </div>
                  )}

                  <Form onSubmit={handleInvoiceSave}>
                    <div className="settings-form-under">
                      <h6>Display Settings</h6>

                      <Row>
                        <Col xl={3} md={6}>
                          <div className="stock-switch mt-0">
                            <Form.Check
                              type="switch"
                              name="showBusinessName"
                              checked={invoice.showBusinessName}
                              onChange={handleInvoiceChange}
                              label="Show Business Name"
                            />
                          </div>
                        </Col>

                        <Col xl={3} md={6}>
                          <div className="stock-switch mt-0">
                            <Form.Check
                              type="switch"
                              name="showGST"
                              checked={invoice.showGST}
                              onChange={handleInvoiceChange}
                              label="Show GST Number"
                            />
                          </div>
                        </Col>

                        <Col xl={3} md={6}>
                          <div className="stock-switch mt-0">
                            <Form.Check
                              type="switch"
                              name="showAddress"
                              checked={invoice.showAddress}
                              onChange={handleInvoiceChange}
                              label="Show Business Address"
                            />
                          </div>
                        </Col>

                        <Col xl={3} md={6}>
                          <div className="stock-switch mt-0">
                            <Form.Check
                              type="switch"
                              name="showLogo"
                              checked={invoice.showLogo}
                              onChange={handleInvoiceChange}
                              label="Show Business Logo"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="settings-form-actions mt-2">
                      <button type="submit" className="resto-primary">
                        <Save size={16} />
                        Save Invoice Settings
                      </button>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default Settings;
