import { useState } from "react";
import styles from "./Login.module.css";
import { verifyOtp } from "../../api/api";
import LoginImage from "../../assets/LoginImage.png";

const OtpVerification = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) return setError("Enter OTP");

    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      alert("OTP verified!");
      window.location.href = `/reset-password?email=${email}`;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
        <img src={LoginImage} alt="SmartVision AI" className={styles.backgroundImage} />
      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h2 className={styles.subtitle}>Verify OTP</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>OTP</label>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          </div>
          <button className={styles.loginBtn} onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
