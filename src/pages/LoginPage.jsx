import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      try {
        login(form.username, form.password);
        onLogin && onLogin();
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }, 600);
  };

  const quickLogin = (username, password) => {
    setForm({ username, password });
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.grid} />

      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <span style={{ fontSize: 28 }}>🗳</span>
          </div>
          <h1 style={styles.title}>VoteChain</h1>
          <p style={styles.subtitle}>Secure Democratic Platform</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <div style={styles.hintsSection}>
          <button style={styles.hintToggle} onClick={() => setShowHints(!showHints)}>
            {showHints ? "Hide" : "Show"} demo accounts
          </button>
          {showHints && (
            <div style={styles.hints}>
              {[
                { username: "admin", password: "admin123", role: "ADMIN", color: "#e74c3c" },
                { username: "manager", password: "manager123", role: "MANAGER", color: "#f39c12" },
                { username: "john", password: "john123", role: "USER", color: "#2ecc71" },
              ].map((acc) => (
                <button key={acc.username} style={{ ...styles.hintBtn, borderColor: acc.color + "55" }}
                  onClick={() => quickLogin(acc.username, acc.password)}>
                  <span style={{ ...styles.roleBadge, background: acc.color + "22", color: acc.color }}>{acc.role}</span>
                  <span style={{ color: "#ccc", fontSize: 13 }}>{acc.username}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        <span style={{ color: "#666", fontSize: 12 }}>
          JWT Auth • Role-Based Access • Secure Voting • Full-Stack System
        </span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "#0a0a0f", position: "relative", overflow: "hidden", padding: 20,
  },
  bg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 30% 50%, #1a0a2e 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, #0a1a2e 0%, transparent 50%)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
    padding: "40px 36px", boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
  },
  logoArea: { textAlign: "center", marginBottom: 32 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
  },
  title: { color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" },
  subtitle: { color: "#888", fontSize: 14, margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "#aaa", fontSize: 13, fontWeight: 500 },
  input: {
    padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.2s",
  },
  error: {
    padding: "10px 14px", borderRadius: 8, background: "rgba(231,76,60,0.15)",
    border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", fontSize: 13,
  },
  btn: {
    marginTop: 8, padding: "14px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.3px",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)", transition: "opacity 0.2s",
  },
  hintsSection: { marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 },
  hintToggle: {
    background: "none", border: "none", color: "#7c3aed", cursor: "pointer",
    fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 12,
  },
  hints: { display: "flex", flexDirection: "column", gap: 8 },
  hintBtn: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
    borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid",
    cursor: "pointer", textAlign: "left", transition: "background 0.2s",
  },
  roleBadge: {
    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.5px",
  },
  footer: { position: "relative", zIndex: 1, marginTop: 24 },
};
