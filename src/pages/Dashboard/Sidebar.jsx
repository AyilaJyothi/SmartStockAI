import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faWarehouse,
  faBorderAll,
  faQrcode,
  faCartArrowDown,
  faTruckFast,
  faChartColumn,
  faGear,
  faCircleQuestion,
  faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

import styles from "./DashboardCSS/Sidebar.module.css";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  // Map menu items to icons
  const iconMap = {
    "Dashboard": faBox,
    "Inventory": faWarehouse,
    "AI – Misplaced Products": faBorderAll,
    "AI – Barcode Scan": faQrcode,
    "Orders": faCartArrowDown,
    "Shipping": faTruckFast,
    "Reports": faChartColumn,
    "Settings": faGear,
    "Help & Support": faCircleQuestion,
    "Log Out": faArrowRightFromBracket
  };

  const topMenu = [
    "Dashboard",
    "Inventory",
    "AI – Misplaced Products",
    "AI – Barcode Scan",
    "Orders",
    "Shipping",
    "Reports"
  ];

  const bottomMenu = [
    { name: "Settings" },
    { name: "Help & Support" },
    { name: "Log Out", danger: true }
  ];

  const renderMenu = (menu) =>
    menu.map((item) => {
      const name = typeof item === "string" ? item : item.name;
      const danger = item.danger || false;

      return (
        <li
          key={name}
          onClick={() => setActive(name)}
          className={`
            ${styles.menuItem}
            ${active === name ? styles.active : ""}
            ${danger ? styles.danger : ""}
          `}
        >
          <FontAwesomeIcon icon={iconMap[name]} className={styles.icon} />
          <span>{name}</span>
        </li>
      );
    });

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>{renderMenu(topMenu)}</ul>
      <ul className={`${styles.menu} ${styles.bottomMenu}`}>
        {renderMenu(bottomMenu)}
      </ul>
    </div>
  );
};

export default Sidebar;
