import axios from "axios";

export const loginUser = (data) => axios.post("http://localhost:3000/api/auth/login", data);
export const sendOtp = (data) => axios.post("http://localhost:3000/api/auth/send-otp", data);
export const verifyOtp = (data) => axios.post("http://localhost:3000/api/auth/verify-otp", data);
export const resetPassword = (data) => axios.post("http://localhost:3000/api/auth/reset-password", data);
