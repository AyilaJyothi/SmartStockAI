import { useState } from "react";
import styles from "./Login.module.css"; 
import LoginImage from "../../assets/LoginImage.png";
import { loginUser } from "../../api/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });

      // ✅ Show alert on successful login
      alert(response.data.message || "Login successful!");

      console.log("Login successful:", response.data);

      // Optionally save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Optionally redirect user
      // window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src={LoginImage} alt="SmartVision AI" className={styles.backgroundImage} />
      <div className={styles.pattern}></div>

      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>SMARTVISION AI</h1>
          <h2 className={styles.subtitle}>Login</h2>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className={`${styles.eyeIcon} ${showPassword ? styles.eyeIconActive : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                <div className={styles.eye}>
                  <div className={styles.pupil}></div>
                </div>
                <div className={styles.slash}></div>
              </span>
            </div>
          </div>

          <div className={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button className={styles.forgot} onClick={() => window.location.href = "/forgot-password"}>Forgot password?</button>
          </div>

          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={styles.footerText}>Smart. Fast. Intelligent.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
