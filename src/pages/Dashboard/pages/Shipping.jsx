import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../DashboardCSS/Shipping.module.css";

const Shipping = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId"); // optional query param

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 2; // same as Orders page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/products/orders");
        let data = res.data;

        if (orderId) {
          data = data.filter((o) => o.orderId === orderId);
        }

        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orderId]);

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Smart pagination numbers with "..."
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last) {
        if (i - last === 2) rangeWithDots.push(last + 1);
        else if (i - last !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  if (loading) return <div>Loading...</div>;
  if (orders.length === 0) return <div>No shipping info found.</div>;

  return (
    <div className={styles.main}>
      <h2>Shipping Timeline {orderId ? `- ${orderId}` : ""}</h2>
      <div className={styles.ordersGrid}>
        {currentOrders.map((order) => (
          <div key={order._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Order ID: {order.orderId}</h3>
              <p>Shop: {order.shopName}</p>
              <p>Status: <span className={styles.status}>{order.status}</span></p>
            </div>

            <div className={styles.cardBody}>
              {order.shippingHistory.map((step, idx) => (
                <div key={idx} className={styles.product}>
                  <div className={styles.productInfo}>
                    <h4>{step.status}</h4>
                    <p>Time: {new Date(step.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <p>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.arrowBtn}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>

          {getPaginationNumbers().map((num, idx) =>
            num === "..." ? (
              <span key={idx} className={styles.dots}>...</span>
            ) : (
              <button
                key={idx}
                className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}

          <button
            className={styles.arrowBtn}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Shipping;
