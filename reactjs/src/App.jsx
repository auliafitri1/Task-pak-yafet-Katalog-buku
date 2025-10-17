import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginModern from "./pages/LoginModern.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import BookDetail from "./pages/user/BookDetail.jsx";
import AdminAddBook from "./pages/admin/AdminAddBook.jsx";
import Books from "./pages/Books.jsx";
import About from "./pages/user/About.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminEditBook from "./pages/admin/AdminEditBook.jsx";


function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* ✅ PERBAIKAN: Route admin yang lebih spesifik dulu */}
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login-modern" />
            )
          }
        />
        <Route
          path="/admin/add-book"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminAddBook />
            ) : (
              <Navigate to="/login-modern" />
            )
          }
        />
        <Route
          path="/admin/edit-book/:id"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminEditBook />
            ) : (
              <Navigate to="/login-modern" />
            )
          }
        />
        
        {/* Route untuk admin root */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Route user */}
        <Route
          path="/"
          element={
            isAuthenticated && role === "user" ? (
              <Dashboard />
            ) : isAuthenticated && role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/login-modern" />
            )
          }
        />
        
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
    
        <Route path="/about" element={<About />} />


        {/* Auth */}
        <Route path="/login-modern" element={<LoginModern />} />
        <Route path="/register" element={<Register/>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;