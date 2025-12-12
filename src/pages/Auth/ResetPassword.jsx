import { useState } from "react";
import styles from "./Login.module.css";
import { resetPassword } from "../../api/api";
import LoginImage from "../../assets/LoginImage.png";

const ResetPassword = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) return setError("Enter both fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await resetPassword({ email, newPassword, confirmPassword });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
        <img src={LoginImage} alt="SmartVision AI" className={styles.backgroundImage} />
      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h2 className={styles.subtitle}>Reset Password</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button className={styles.loginBtn} onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
