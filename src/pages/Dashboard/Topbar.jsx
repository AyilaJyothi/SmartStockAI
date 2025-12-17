import styles from "./DashboardCSS/Topbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const Topbar = ({ notifications = 0, sidebarOpen, setSidebarOpen }) => {

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        {/* Logo only visible when sidebar is open */}
        {sidebarOpen && <h2 className={styles.logo}>SmartStock AI</h2>}

        {/* Toggle button */}
        <div className={styles.toggleButton} onClick={handleToggle}>
          <FontAwesomeIcon icon={sidebarOpen ? faAngleLeft : faAngleRight} />
        </div>

        {/* Search input */}
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search products, SKU..."
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        </div>
      </div>

      <div className={styles.right}>
        {/* Notification bell */}
        <div className={styles.notification}>
          <FontAwesomeIcon icon={faBell} />
          {notifications > 0 && (
            <span className={styles.badge}>{notifications}</span>
          )}
        </div>

        {/* User icon */}
        <span className={styles.user}>
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
    </div>
  );
};

export default Topbar;
