import { useState } from "react";
import { Mail, Eye, EyeOff, X, Apple } from "lucide-react";
import LoginBanner from "../assets/images/login1.png";
import Logo from "../assets/images/logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("daniel22fisher@gmail.com");
  const [password, setPassword] = useState("12345678");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Illustration */}
        <div className="login-illustration">
          <img src={LoginBanner} alt="Login " />
        </div>

        {/* Right Login Form */}
        <div className="login-content">
          <div className="login-inner">
            <div className="text-center">
              <img src={Logo} alt="logo" />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="login-field">
                <label>Email</label>

                <div className="login-input-box">
                  <Mail size={17} />

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label>Password</label>

                <div className="login-input-box">
                  <button
                    type="button"
                    className="login-input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="login-forgot">
                <a href="/forgot-password">Forgot Password?</a>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-submit">
                Log In
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span></span>
              <p>Or Continue With</p>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
