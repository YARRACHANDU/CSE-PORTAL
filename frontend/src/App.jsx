import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Nested routes under EventDetail */}
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
