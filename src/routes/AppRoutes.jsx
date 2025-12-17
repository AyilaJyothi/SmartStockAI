import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OtpVerification from "../pages/Auth/OtpVerification";
import ResetPassword from "../pages/Auth/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import tester from "../pages/tester";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tester" element={<tester />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
