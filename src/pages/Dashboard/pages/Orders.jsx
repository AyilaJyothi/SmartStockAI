import { useEffect, useState } from "react";
import styles from "../DashboardCSS/Order.module.css";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/products/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

   // Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // For smart pagination with "..."
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

  return (
    <div className={styles.main}>
       <h2 className={styles.ordersTitle}>Orders</h2>
      <div className={styles.ordersGrid}>
        {currentOrders.map((order) => (
          <div className={styles.card} key={order._id}>
            <div className={styles.cardHeader}>
              <h3>Order ID: {order.orderId}</h3>
              <p>Shop: {order.shopName}</p>
              <p>Status: <span className={styles.status}>{order.status}</span></p>
            </div>
          <div className={styles.cardBody}>
  {order.items.map((item, index) => (
    <div className={styles.product} key={index}>
      <img
        src={`http://localhost:3000/${item.product.Image}`} 
        alt={item.product.Title}
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <h4>{item.product.Title}</h4>
        <p>Category: {item.product.Category}</p>
        <p>Qty: {item.quantity}</p>
        <p>Price: ₹{item.product.Price}</p>
      </div>
    </div>
  ))}
</div>

            <div className={styles.cardFooter}>
              <strong>Total: ₹{order.totalPrice}</strong>
              <p>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</p>
                <button
    className={styles.shippingBtn}
    onClick={() => window.location.href = `/dashboard/shipping?orderId=${order.orderId}`}
  >
    Shipping Info
  </button>
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

export default Orders;
