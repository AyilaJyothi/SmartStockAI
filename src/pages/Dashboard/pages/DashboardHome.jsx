import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getProducts ,getFilterOptions} from "../../../api/api";
import styles from "../DashboardCSS/DashboardHome.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const DashboardHome = () => {
  /* 🔍 SEARCH FROM TOPBAR */
  const { search = "" } = useOutletContext();

  /* DATA */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER OPTIONS FROM BACKEND */
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [statuses, setStatuses] = useState([]);


  /* FILTER STATES */
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterWarehouse, setFilterWarehouse] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  /* HELPERS */
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getStockStatus = (qty, minStock, maxStock) => {
  if (qty === 0) return "Out of Stock";
  if (qty <= minStock) return "Low Stock";
  if (qty > minStock && qty <= maxStock) return "In Stock";
  return "Over Stock";
};

  /* FETCH PRODUCTS (FILTERED + PAGINATED) */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({
          search,
          category: filterCategory,
          status: filterStatus,
          warehouse: filterWarehouse,
          page: currentPage,
          limit: itemsPerPage,
        });

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        // setCategories(res.data.categories || []);
        // setWarehouses(res.data.warehouses || []);

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    search,
    filterCategory,
    filterStatus,
    filterWarehouse,
    currentPage,
  ]);

  /* FETCH FILTER OPTIONS (ONLY ONCE) */
useEffect(() => {
  const fetchFilters = async () => {
    try {
      const res = await getFilterOptions();
      setCategories(res.data.categories || []);
      setWarehouses(res.data.warehouses || []);
      setStatuses(res.data.status || []);
    } catch (err) {
      console.error("Filter fetch error:", err);
    }
  };

  fetchFilters();
}, []);


  /* RESET PAGE WHEN FILTER CHANGES */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory, filterStatus, filterWarehouse]);

  /* PAGINATION NUMBERS */
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta &&
          i <= currentPage + delta)
      ) {
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

  const getButtonText = (value, label) =>
    value === "All" ? label : value;

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>Dashboard</h2>

        <div className={styles.actions}>
          {/* CATEGORY */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("category")}>
              {getButtonText(filterCategory, "Category")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "category" && (
              <ul className={styles.dropdown}>
                {/* <li onClick={() => setFilterCategory("All")}>
                  All
                </li> */}
                {categories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* STATUS */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("status")}>
              {getButtonText(filterStatus, "Status")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "status" && (
              <ul className={styles.dropdown}>
                {[
                  "All",
                  "In Stock",
                  "Low Stock",
                  "Out of Stock",
                ].map((st) => (
                  <li
                    key={st}
                    onClick={() => setFilterStatus(st)}
                  >
                    {st}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* WAREHOUSE */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("warehouse")}>
              {getButtonText(filterWarehouse, "Warehouse")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "warehouse" && (
              <ul className={styles.dropdown}>
                {/* <li
                  onClick={() => setFilterWarehouse("All")}
                >
                  All
                </li> */}
                {warehouses.map((wh) => (
                  <li
                    key={wh}
                    onClick={() => setFilterWarehouse(wh)}
                  >
                    {wh}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
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
              <th>Stock</th>
              <th>Last Modified</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="9">No products found</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.SKU}</td>
                  <td>
                    <img
                      src={`http://localhost:3000${p.Image}`}
                      alt={p.Title}
                    />
                  </td>
                  <td>{p.Title}</td>
                  <td>{p.Category}</td>
                  <td>{p.QTY}</td>
                  <td>{p.Warehouse}</td>
                  <td>₹ {p.Price}</td>
                  <td>
  <span
    className={`${styles.stock} ${
      styles[
        getStockStatus(
          p.QTY,
          p.minStock,
          p.maxStock
        ).replace(/\s/g, "")
      ]
    }`}
  >
    {getStockStatus(p.QTY, p.minStock, p.maxStock)}
  </span>
</td>

                  <td>
                    {new Date(
                      p["LastModified"]
                    ).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.arrowBtn}
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
          >
            &lt;
          </button>

          {getPaginationNumbers().map((num, idx) =>
            num === "..." ? (
              <span key={idx} className={styles.dots}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                className={`${styles.pageBtn} ${
                  currentPage === num
                    ? styles.activePage
                    : ""
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}

          <button
            className={styles.arrowBtn}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
