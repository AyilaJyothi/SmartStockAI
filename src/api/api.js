import axios from "axios";

export const loginUser = (data) => axios.post("http://localhost:3000/api/auth/login", data);
export const sendOtp = (data) => axios.post("http://localhost:3000/api/auth/send-otp", data);
export const verifyOtp = (data) => axios.post("http://localhost:3000/api/auth/verify-otp", data);
export const resetPassword = (data) => axios.post("http://localhost:3000/api/auth/reset-password", data);
export const getProducts = (params) =>axios.get("http://localhost:3000/api/products", { params });

export const getFilterOptions = () => axios.get("http://localhost:3000/api/products/filters");

export const getProductBySKU = (sku) =>axios.get(`http://localhost:3000/api/products/sku/${sku}`);

export const getInventoryAnalytics = (sku) =>axios.get(`http://localhost:3000/api/products/inventory/analytics/${sku}`);

export const updateProductBySKU = (sku, data) =>axios.put(`http://localhost:3000/api/products/sku/${sku}`, data);
export const fetchNotifications = async (token) => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/products/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return [];
    }

    // ✅ Only read the body once
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};



export const deleteNotification = async (id, token) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/products/notifications/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete notification");
    }

    return await res.json(); // Return the server response
  } catch (err) {
    console.error("Delete notification error:", err);
    throw err;
  }
};


