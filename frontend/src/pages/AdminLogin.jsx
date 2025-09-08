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
    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        style={{ padding: "0.5rem" }}
      />
      <button
        type="submit"
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
