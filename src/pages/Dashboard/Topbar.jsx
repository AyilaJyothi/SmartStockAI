import { useState, useEffect, useRef } from "react";
import styles from "./DashboardCSS/Topbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faMagnifyingGlass, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { deleteNotification, fetchNotifications } from "../../api/api";
// import { toast } from "react-toastify";

const Topbar = ({ sidebarOpen, setSidebarOpen, search, setSearch, notifications, setNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const token = sessionStorage.getItem("token");

  // const seenRef = useRef({}); // track seen notifications without causing re-renders

  // ===== Fetch notifications once on mount =====
 useEffect(() => {
  if (!token) return;

  const getNotifications = async () => {
    try {
      const data = await fetchNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // 🔹 Initial fetch
  getNotifications();

  // 🔹 Poll every 5 seconds
  const interval = setInterval(() => {
    getNotifications();
  }, 5000);

  return () => clearInterval(interval);

}, [token, setNotifications]);

  // ===== Handle bell click =====
 const handleBellClick = async () => {
  setShowNotifications(!showNotifications);

  if (!showNotifications) {
    if (!token) return;

    try {
      const latestNotifications = await fetchNotifications(token);
      setNotifications(latestNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }
};

 const handleDelete = async (id) => {
  if (!token) return;

  try {
    await deleteNotification(id, token);
    setNotifications(prev => prev.filter(n => n._id !== id));
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <h2 className={styles.logo}>SmartStock AI</h2>

        <div className={styles.toggleButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FontAwesomeIcon icon={sidebarOpen ? faAngleLeft : faAngleRight} />
        </div>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search by SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        </div>
      </div>

      <div className={styles.right}>
        {/* Notification Wrapper */}
  <div className={styles.notificationWrapper} ref={dropdownRef}>
    
    <div className={styles.notification} onClick={handleBellClick}>
      <FontAwesomeIcon icon={faBell} />
      {notifications.length > 0 && (
        <span className={styles.badge}>{notifications.length}</span>
      )}
    </div>

    {showNotifications && (
      <div className={styles.notificationDropdown}>
        {notifications.length === 0 ? (
          <p className={styles.empty}>No Notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n._id} className={styles.notificationItem}>
              <span>{n.message}</span>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(n._id)}
                className={styles.deleteIcon}
              />
            </div>
          ))
        )}
      </div>
    )}

  </div>

        <span className={styles.user}>
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
    </div>
  );
};

export default Topbar;
