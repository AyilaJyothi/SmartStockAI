import { useState } from "react";
import styles from "./Login.module.css";
import { sendOtp } from "../../api/api";
import LoginImage from "../../assets/LoginImage.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    if (!email) return setError("Enter your email");

    setLoading(true);
    try {
      const res = await sendOtp({ email });
      alert(res.data.message);
      // redirect to OTP page
      window.location.href = `/otp?email=${email}`;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
        <img src={LoginImage} alt="SmartVision AI" className={styles.backgroundImage} />
      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h2 className={styles.subtitle}>Forgot Password</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className={styles.loginBtn} onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
