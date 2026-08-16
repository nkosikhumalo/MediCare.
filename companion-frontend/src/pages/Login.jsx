import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/home";

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login(email, password);
      saveAuth(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="topbar">
        <button
          className="cancel-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>

      <div className="wrap">
        <Logo />

        <h1>Log in</h1>

        <p className="subtitle">
          Your login details work across all connected services.
        </p>

        <div className="login-card">
          <form onSubmit={handleLogin}>
            <div className="field">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <label>Email</label>
            </div>

            <div className="field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <label>Password</label>

              <button
                type="button"
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                👁
              </button>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </form>
        </div>

        <div className="divider-copy">
          If you&apos;ve <strong>forgotten your password</strong> or your
          <strong> account is locked</strong>, use the link below.
          <br /><br />
          <a href="#">Forgot username or password?</a>
        </div>

        <h3 className="platform-title">
          You can also log into the following platforms:
        </h3>

        <div className="platform-card">FundsAtWork employers</div>
        <div className="platform-card">Health zone</div>
        <div className="platform-card">Retirement administrators</div>
      </div>

      <button className="help-fab" type="button" aria-label="Help">?</button>
    </div>
  );
}

export default Login;
