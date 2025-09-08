import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <Link to="/admin">Dashboard</Link>
        ) : (
          <Link to="/admin/login">Admin Login</Link>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id/*" element={<EventDetail />} />
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" />
            ) : (
              <AdminLogin onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
