import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/admin/login", { password })
      .then((res) => {
        if (res.data.success) onLogin();
      })
      .catch(() => setError("Invalid password"));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative", // Needed for positioning back button
      }}
    >
      {/* Back Button on top-left */}
      <button
        onClick={() => window.history.back()}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem", // Position on the left side
          backgroundColor: "transparent",
          border: "none",
          color: "#2563eb", // your blue color
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#dbeafe")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        aria-label="Go back"
      >
        &larr;<a href="/"> Back</a>
      </button>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#1e3a8a", // Your blue color
            textAlign: "center",
          }}
        >
          Admin Login
        </h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "1.5px solid #3b82f6", // blue border
            fontSize: "1rem",
            marginBottom: "1rem",
            boxSizing: "border-box",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#3b82f6")}
          autoFocus
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#2563eb", // darker blue
            color: "white",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Login
        </button>
        {error && (
          <p
            style={{
              color: "#dc2626", // red-600
              marginTop: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
