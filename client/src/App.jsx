import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Home from "../pages/Home.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* 🌍 PUBLIC ROUTE (WITH NAVBAR) */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      
      {/* 🔒 USER DASHBOARD (PROTECTED - USER ONLY) */}
      <Route 
        path="/user/*" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* 🔒 ADMIN DASHBOARD (PROTECTED - ADMIN ONLY) */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}