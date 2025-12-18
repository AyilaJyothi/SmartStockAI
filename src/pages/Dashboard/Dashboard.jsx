import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
// import MainContent from "./MainContent";
import { Outlet } from "react-router-dom";
import styles from "./DashboardCSS/Dashboard.module.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.dashboardLayout}>
      {/* Top bar */}
      <Topbar 
        notifications={3} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Body section */}
      <div className={styles.body}>
        {sidebarOpen && <Sidebar />}
        <Outlet />
        {/* <MainContent /> */}
      </div>
    </div>
  );
};

export default Dashboard;
