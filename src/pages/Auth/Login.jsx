import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import LoginImage from "../../assets/LoginImage.png";
import { loginUser } from "../../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password, rememberMe });


      // if (rememberMe) {
      //   localStorage.setItem("token", response.data.token);
      // } else {
      //   sessionStorage.setItem("token", response.data.token);
      // }
      sessionStorage.setItem("token", response.data.token);


      // ⏳ IMPORTANT: Delay navigation so Chrome can save password
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src={LoginImage} alt="SmartVision AI" className={styles.backgroundImage} />
      <div className={styles.pattern}></div>

      <div className={styles.rightSide}>
        <form
          className={styles.loginBox}
          method="POST"
          onSubmit={handleSubmit}
        >
          <h1 className={styles.title}>SMARTVISION AI</h1>
          <h2 className={styles.subtitle}>Login</h2>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="username"
              autoComplete="username"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              className={styles.forgot}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={styles.footerText}>Smart. Fast. Intelligent.</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
