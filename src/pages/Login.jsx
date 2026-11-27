import React, { useRef, useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff, Check } from "lucide-react";
import LoginBack from "../assets/images/login-back.jpg";

import logo from "../assets/images/logo-login.png";

function App() {
  const brandRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStatus({
        message:
          "Login form submitted successfully. Connect your authentication API to complete sign-in.",
        type: "success",
      });
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setStatus({
      message: `${provider} login integration is not configured yet.`,
      type: "error",
    });
  };

  return (
    <>
      <style>{`
.page {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  min-height: 100vh;
  min-height: 100dvh;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.page *,
.page *::before,
.page *::after {
  box-sizing: border-box;
}

.page h1,
.page h2,
.page p,
.page ul {
  margin: 0;
}

.page ul {
  padding: 10px 0;
  list-style: none;
}

.page a {
  color: inherit;
}

.page button {
  font: inherit;
  cursor: pointer;
}

/* Brand panel */

.brand {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 40px;
  color: #f0fdf0;
  display: flex;
  background-color: #164d0b;
  background-image:linear-gradient(
      to bottom,
      rgb(39 126 19 / 60%) 0%,
      rgb(31 105 12 / 84%) 48%,
      rgba(12, 48, 9, .72) 100%
    ),
    url("${LoginBack}");
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
}

.brand::before,
.brand::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
}

.brand::before {
    z-index: 1;
   background-image: radial-gradient(circle, rgb(74 165 47) 1.15px, transparent 1.8px);
    background-size: 28px 28px;
    background-position: 0 0;
    animation: dotBlink 3.2s ease-in-out infinite;
}
@keyframes dotBlink {
  0%, 100% {
    opacity: .22;
  }
  50% {
    opacity: .95;
  }
}

.brand__glow {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  filter: blur(70px);
  opacity: .45;
  pointer-events: none;
}

.brand__glow--a {
  width: 420px;
  height: 420px;
  background: #65c746;
  top: -120px;
  right: -120px;
}

.brand__glow--b {
  width: 360px;
  height: 360px;
  background: #65c746;
  bottom: -180px;
  left: -140px;
  opacity: .55;
}

.brand__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 520px;
  margin: auto;
}

.brand__copy h1 {
  font-size: clamp(26px, 1.6vw, 38px);
  line-height: 1.2;
  letter-spacing: -.02em;
  font-weight: 650;
}

.brand__copy p {
    margin: 20px 0;
    color: #f0fff5;
    font-size: 14px;
    line-height: 1.65;
    max-width: 44ch;
}

.brand__points {
  margin-top: 28px;
  display: grid;
  gap: 12px;
}

.brand__points li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #ecfdf5;
}

.brand__points svg {
  flex: none;
  padding: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(187, 247, 208, .18);
  stroke: #bbf7d0;
  stroke-width: 2.6;
}

.brand__foot {
     font-size: 12.5px;
    color: #37d00f;
}

/* Logo */

.logo img {
    width: 200px;
}
/* Panel / card */

.panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.card__head h2 {
  font-size: 24px;
  letter-spacing: -.02em;
  font-weight: 650;
}

.card__head p {
    margin-top: 4px;
    color: #8d8d8d;
    font-size: 13px;
    font-weight: 550;
}

/* Form */

.form {
  margin-top: 24px;
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 7px;
}

.label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.page label {
font-size: 12.5px;
    font-weight: 550;
    color: #838282;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    color: #19620c;
    pointer-events: none;
    z-index: 1;
}

.page input[type="email"],
.page input[type="password"],
.page input[type="text"] {
  width: 100%;
  height: 48px;
  padding: 0 42px 0 38px;
  font-size: 12.5px;
  color: #0f172a;
  background: #fbfefb;
  border: 1px solid #dcebd8;
  border-radius: 10px;
  outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}

.page input::placeholder {
  color: #a8b3a5;
}

.page input:hover {
  border-color: #a8d49d;
}

.page input:focus {
  background: #fff;
  border-color: #278a0e;
  box-shadow: 0 0 0 3.5px rgba(39, 138, 14, .14);
}

.page input[aria-invalid="true"] {
  border-color: #dc2626;
  background: #fff7f7;
}

.page input[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3.5px rgba(220, 38, 38, .13);
}

/* Show / hide password */

.toggle {
  position: absolute;
  right: 6px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: #94a3b8;
  background: transparent;
}

.toggle:hover {
  color: #278a0e;
  background: #f0f7ed;
}

.toggle:focus-visible {
  outline: 2px solid #278a0e;
  outline-offset: 1px;
}

.toggle svg {
  stroke: currentColor;
}

/* Errors */

.error {
  min-height: 0;
  font-size: 12.5px;
  line-height: 1.4;
  color: #dc2626;
  display: none;
}

.error.is-visible {
  display: block;
}

/* Checkbox */

.check {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13.5px;
  font-weight: 450;
  color: #475569;
  cursor: pointer;
  user-select: none;
  margin-top: 2px;
}

.check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.check__box {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 5px;
  background: #fff;
  transition: background .15s, border-color .15s;
}

.check__box svg {
  stroke: #fff;
  stroke-width: 3;
  fill: none;
  opacity: 0;
  transition: opacity .12s;
}

.check input:checked + .check__box {
  background: #278a0e;
  border-color: #278a0e;
}

.check input:checked + .check__box svg {
  opacity: 1;
}

.check input:focus-visible + .check__box {
  box-shadow: 0 0 0 3.5px rgba(39, 138, 14, .16);
}

/* Submit */

.login-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 46px;
    margin-top: 4px;
    border: 0;
    border-radius: 10px;
    font-size: 14.5px !important;
    font-weight: 600 !important;
    color: #fff;
    background: linear-gradient(180deg, #3bbd1d, #2e9d12);
    box-shadow: 0 1px 2px rgba(39, 138, 14, .35), inset 0 1px 0 rgba(255, 255, 255, .18);
    transition: transform .08s, filter .15s, box-shadow .15s;
}

.login-btn:hover {
  filter: brightness(1.06);
}

.login-btn:active {
  transform: translateY(1px);
}

.login-btn:focus-visible {
  outline: 2px solid #278a0e;
  outline-offset: 2px;
}

.login-btn:disabled {
  cursor: progress;
  filter: saturate(.85) brightness(.98);
}

.spinner {
  display: block;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, .45);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Status line */

.form-status {
  font-size: 13px;
  line-height: 1.5;
  display: none;
  padding: 9px 11px;
  border-radius: 8px;
}

.form-status.is-visible {
  display: block;
}

.form-status.is-error {
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.form-status.is-success {
  color: #14532d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

/* Links / foot */

.page .link {
  color: #278a0e;
  font-size: 13px;
  font-weight: 550;
  text-decoration: none;
}

.page .link:hover {
  color: #1e6d0b;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.signup {
  margin-top: 22px;
  text-align: center;
  font-size: 13.5px;
  color: #475569;
}

.stamp {
      margin-top: 20px;
    padding-top: 14px;
    text-align: center;
    font-size: 11.5px;
    color: #899e85;
}

/* Responsive */

@media (max-width: 960px) {
  .page {
    grid-template-columns: 1fr;
    background: #fff;
  }

  .brand {
    display: none;
  }

  .page .logo--mobile {
    display: inline-flex !important;
  }

  .panel {
    padding: 32px 20px;
    align-items: flex-start;
  }

  .card__head {
    border: 0;
    box-shadow: none;
    background: transparent;
    padding: 8px 4px 24px;
    max-width: 420px;
  }
}

@media (max-width: 340px) {
  .card__head {
    padding: 4px 0 20px;
  }

  .card__head h2 {
    font-size: 22px;
  }

  .socials {
    grid-template-columns: 1fr;
  }
}

/* Motion / accessibility */

@media (prefers-reduced-motion: reduce) {
  .page *,
  .page *::before,
  .page *::after {
    animation-duration: .001ms !important;
    transition-duration: .001ms !important;
  }
}

      `}</style>
      <main className="page">
        <section className="brand" ref={brandRef}>
          <div className="brand__glow brand__glow--a"></div>
          <div className="brand__glow brand__glow--b"></div>
          <div className="brand__inner">
            <a href="/" className="logo">
              <img src={logo} alt="" />
            </a>

            <div className="brand__copy">
              <h1>Welcome to smarter restaurant management.</h1>

              <p>
                Simplify your restaurant operations, manage orders, track sales,
                and deliver exceptional dining experiences — all from one
                powerful platform.
              </p>

              <ul className="brand__points">
                <li>
                  <Check size={22} />
                  Manage orders, tables, and billing effortlessly
                </li>
                <li>
                  <Check size={22} />
                  Track inventory, menu items, and daily sales
                </li>
                <li>
                  <Check size={22} />
                  Keep your entire restaurant running smoothly
                </li>
              </ul>
            </div>

            <div className="brand__foot">
              © {new Date().getFullYear()} Restonest. All rights reserved.
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="login-card">
            <div className="card__head">
              <h2>Welcome back</h2>
              <p>Enter your details to sign in to your account.</p>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <div className="label-row">
                  <label htmlFor="email">Email address</label>
                </div>

                <div className="input-wrap">
                  <Mail className="input-icon" size={15} />

                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                </div>

                <span className={`error ${errors.email ? "is-visible" : ""}`}>
                  {errors.email}
                </span>
              </div>

              <div className="field">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                </div>

                <div className="input-wrap">
                  <LockKeyhole className="input-icon" size={15} />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    aria-invalid={!!errors.password}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <span
                  className={`error ${errors.password ? "is-visible" : ""}`}
                >
                  {errors.password}
                </span>
              </div>

              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="check__box">
                  <Check size={13} />
                </span>
                Remember me
              </label>

              <button
                type="submit"
                className={`login-btn ${loading ? "is-login-loading" : ""}`}
                disabled={loading}
              >
                {loading && <span className="spinner"></span>}
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div
                className={`form-status ${
                  status.message ? "is-visible" : ""
                } ${status.type === "error" ? "is-error" : "is-success"}`}
                role="status"
              >
                {status.message}
              </div>
            </form>

            <div className="stamp">Secure login · Privacy protected</div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
