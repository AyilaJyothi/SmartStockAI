import styles from "../DashboardCSS/MainContent.module.css";

const Orders = () => (
  <div className={styles.main}>
    <h2>Orders</h2>
    <div className={styles.card}>
      Incoming & outgoing orders
    </div>
  </div>
);

export default Orders;
