import { useEffect, useState } from "react";
import styles from "../DashboardCSS/Report.module.css";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://smartstockaibackend.onrender.com/api/products/orders");
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading reports...</div>;

  // ====== Total Orders ======
  const totalOrders = orders.length;

  // ====== Orders by Status ======
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Orders by Status",
        data: statusData,
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  // ====== Top Selling Products ======
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const title = item.product.Title;
      productSales[title] = (productSales[title] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topProductsLabels = topProducts.map(p => p[0]);
  const topProductsData = topProducts.map(p => p[1]);

  const topProductsChartData = {
    labels: topProductsLabels,
    datasets: [
      {
        label: "Top Selling Products",
        data: topProductsData,
        backgroundColor: "#0d0d44",
      },
    ],
  };

  // ====== Revenue Over Time ======
  const revenueMap = {};
  orders.forEach(order => {
    const date = new Date(order.orderDate).toLocaleDateString();
    revenueMap[date] = (revenueMap[date] || 0) + order.totalPrice;
  });

  const revenueLabels = Object.keys(revenueMap);
  const revenueData = Object.values(revenueMap);

  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue Over Time (₹)",
        data: revenueData,
        borderColor: "#28a745",
        backgroundColor: "#28a74533",
      },
    ],
  };

  return (
    <div className={styles.main}>
      <h2 className={styles.mainTitle}>Reports Dashboard</h2>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className={styles.card}>
          <h3>Pending Orders</h3>
          <p>{statusCounts.Pending || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Shipped Orders</h3>
          <p>{statusCounts.Shipped || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Delivered Orders</h3>
          <p>{statusCounts.Delivered || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <Bar data={statusChartData} />
        </div>
        <div className={styles.chartCard}>
          <Bar data={topProductsChartData} />
        </div>
        <div className={styles.chartCard}>
          <Line data={revenueChartData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
