import { useState, useEffect, useRef } from "react";
import styles from "./DashboardCSS/Topbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faMagnifyingGlass, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { deleteNotification, fetchNotifications } from "../../api/api";
import { toast } from "react-toastify";

const Topbar = ({ sidebarOpen, setSidebarOpen, search, setSearch, notifications, setNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const token = sessionStorage.getItem("token");

  const seenRef = useRef({}); // track seen notifications without causing re-renders

  // ===== Fetch notifications once on mount =====
  useEffect(() => {
    if (!token) return;

    const getNotifications = async () => {
      const data = await fetchNotifications(token);
      console.log("Backend notifications fetched:", data);
      setNotifications(data);
      // reset seenRef to avoid showing phantom old notifications
      seenRef.current = {};
    };

    getNotifications();
  }, [token, setNotifications]);

  // ===== Handle bell click =====
  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications) { // only when opening dropdown
      if (!token) return;

      try {
        const latestNotifications = await fetchNotifications(token);
        console.log("Notifications to show on bell click:", latestNotifications);

        // Show toasts only for unseen notifications
        latestNotifications.forEach(n => {
          if (!seenRef.current[n._id]) {
            if (n.type === "DEFECT") toast.error(n.message);
            else toast.info(n.message);
            seenRef.current[n._id] = true;
          }
        });

        // Update notifications state to latest
        setNotifications(latestNotifications);

      } catch (err) {
        console.error("Failed to fetch notifications on bell click:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;

    try {
      await deleteNotification(id, token);
      setNotifications(prev => prev.filter(n => n._id !== id));
      delete seenRef.current[id]; // remove from seen
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete notification");
    }
  };

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
        <div className={styles.notification} onClick={handleBellClick}>
          <FontAwesomeIcon icon={faBell} />
          {notifications.length > 0 && <span className={styles.badge}>{notifications.length}</span>}
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

        <span className={styles.user}>
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
    </div>
  );
};

export default Topbar;
