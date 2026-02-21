import axios from "axios";

const BASE_URL = "https://smartstockaibackend.onrender.com/api/products";

// Auth APIs
export const loginUser = (data) => axios.post("https://smartstockaibackend.onrender.com/api/auth/login", data);
export const sendOtp = (data) => axios.post("https://smartstockaibackend.onrender.com/api/auth/send-otp", data);
export const verifyOtp = (data) => axios.post("https://smartstockaibackend.onrender.com/api/auth/verify-otp", data);
export const resetPassword = (data) => axios.post("https://smartstockaibackend.onrender.com/api/auth/reset-password", data);

// Product APIs
export const getProducts = (params) => axios.get(BASE_URL, { params });
export const getFilterOptions = () => axios.get(`${BASE_URL}/filters`);
export const getProductBySKU = (sku) => axios.get(`${BASE_URL}/sku/${sku}`);
export const getInventoryAnalytics = (sku) => axios.get(`${BASE_URL}/inventory/analytics/${sku}`);
export const updateProductBySKU = (sku, data) => axios.put(`${BASE_URL}/sku/${sku}`, data);

// Notifications
export const fetchNotifications = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const deleteNotification = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete notification");
    }

    return await res.json();
  } catch (err) {
    console.error("Delete notification error:", err);
    throw err;
  }
};

// Misplaced products check
export const checkMisplaced = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/misplaced-check`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { image: ..., results: [...] }
  } catch (err) {
    console.error("Misplaced check error:", err);
    throw err;
  }
};


export const askAI = (question, token) =>
  fetch("https://smartstockaibackend.onrender.com/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ question })
  }).then(res => res.json());

  const ORDER_BASE = "https://smartstockaibackend.onrender.com/api/orders";

export const getOrdersAPI = () => axios.get(ORDER_BASE);
export const createOrderAPI = (data) => axios.post(ORDER_BASE, data);
