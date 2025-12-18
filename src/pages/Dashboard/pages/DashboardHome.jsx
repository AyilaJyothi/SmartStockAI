import { useState, useEffect } from "react";
import { getProducts } from "../../../api/api";
import styles from "../DashboardCSS/DashboardHome.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const DashboardHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryOptions = [
    "All",
    "Food Staples",
    "Beverages",
    "Dairy",
    "Bakery",
    "Snacks",
    "Personal Care",
    "Household",
    "Kitchen"
  ];
  const statusOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];
  const warehouseOptions = [
    "All",
    "Location A",
    "Location B",
    "Location C",
    "Location D",
    "Location F",
    "Location G",
    "Location H",
    "Location T",
    "Multiple 22"
  ];

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterWarehouse, setFilterWarehouse] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getStatus = (qty) => {
    if (qty === 0) return "Out of Stock";
    if (qty < 10) return "Low Stock";
    return "In Stock";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    return (
      (filterCategory === "All" || p.Category === filterCategory) &&
      (filterStatus === "All" || getStatus(p.QTY) === filterStatus) &&
      (filterWarehouse === "All" || p.Warehouse.includes(filterWarehouse))
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const getButtonText = (filter, defaultText) => {
    return filter === "All" ? defaultText : filter;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <div className={styles.actions}>
          {/* Category Filter */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("category")}>
              {getButtonText(filterCategory, "Category")} <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "category" && (
              <ul className={styles.dropdown}>
                {categoryOptions.map((cat) => (
                  <li key={cat} onClick={() => { setFilterCategory(cat); setOpenDropdown(null); }}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status Filter */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("status")}>
              {getButtonText(filterStatus, "Status")} <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "status" && (
              <ul className={styles.dropdown}>
                {statusOptions.map((status) => (
                  <li key={status} onClick={() => { setFilterStatus(status); setOpenDropdown(null); }}>
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Warehouse Filter */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("warehouse")}>
              {getButtonText(filterWarehouse, "Warehouse")} <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "warehouse" && (
              <ul className={styles.dropdown}>
                {warehouseOptions.map((wh) => (
                  <li key={wh} onClick={() => { setFilterWarehouse(wh); setOpenDropdown(null); }}>
                    {wh}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>QTY</th>
              <th>Warehouse</th>
              <th>Price</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : currentProducts.length === 0 ? (
              <tr><td colSpan="8">No products found</td></tr>
            ) : (
              currentProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.SKU}</td>
                  <td><img src={`http://localhost:3000${p.Image}`} alt={p.Title} /></td>
                  <td>{p.Title}</td>
                  <td>{p.Category}</td>
                  <td>{p.QTY}</td>
                  <td>{p.Warehouse}</td>
                  <td>₹ {p.Price}</td>
                  <td>
  {new Date(p["Last Modified"]).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className={styles.arrowBtn}>
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
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className={styles.arrowBtn}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
