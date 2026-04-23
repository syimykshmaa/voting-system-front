import React from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", roles: ["ADMIN", "MANAGER", "USER"] },
  { id: "elections", label: "Elections", icon: "🗳", roles: ["ADMIN", "MANAGER", "USER"] },
  { id: "vote", label: "Vote Now", icon: "✓", roles: ["USER", "ADMIN", "MANAGER"] },
  { id: "results", label: "Results", icon: "◉", roles: ["ADMIN", "MANAGER", "USER"] },
  { id: "manage-elections", label: "Manage Elections", icon: "⚙", roles: ["ADMIN", "MANAGER"] },
  { id: "users", label: "Users", icon: "◎", roles: ["ADMIN"] },
  { id: "audit", label: "Audit Log", icon: "≡", roles: ["ADMIN"] },
];

const ROLE_COLOR = { ADMIN: "#e74c3c", MANAGER: "#f39c12", USER: "#2ecc71" };

export default function Navbar({ activePage, onNavigate }) {
  const { currentUser, logout, hasRole } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => hasRole(...item.roles));

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🗳</span>
        <div>
          <div style={styles.logoText}>VoteChain</div>
          <div style={styles.logoSub}>v2.4.1</div>
        </div>
      </div>

      <div style={styles.userCard}>
        <div style={styles.avatar}>
          {currentUser?.name?.charAt(0)}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{currentUser?.name}</div>
          <div style={{ ...styles.rolePill, background: ROLE_COLOR[currentUser?.role] + "22", color: ROLE_COLOR[currentUser?.role] }}>
            {currentUser?.role}
          </div>
        </div>
      </div>

      <div style={styles.navItems}>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            style={{ ...styles.navItem, ...(activePage === item.id ? styles.navItemActive : {}) }}
            onClick={() => onNavigate(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {activePage === item.id && <div style={styles.activeIndicator} />}
          </button>
        ))}
      </div>

      <button style={styles.logoutBtn} onClick={logout}>
        <span>↩</span> Sign Out
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    width: 240, minHeight: "100vh", background: "#0d0d14",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column", padding: "20px 0",
    flexShrink: 0,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16,
  },
  logoIcon: { fontSize: 24 },
  logoText: { color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" },
  logoSub: { color: "#555", fontSize: 11 },
  userCard: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "0 12px 20px", padding: "10px 12px",
    background: "rgba(255,255,255,0.04)", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  avatar: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0,
  },
  userInfo: { minWidth: 0 },
  userName: { color: "#fff", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  rolePill: { display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginTop: 3, letterSpacing: "0.5px" },
  navItems: { flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" },
  navItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
    borderRadius: 8, border: "none", background: "transparent",
    color: "#777", cursor: "pointer", fontSize: 13, fontWeight: 500,
    textAlign: "left", position: "relative", transition: "all 0.15s",
    width: "100%",
  },
  navItemActive: {
    background: "rgba(124,58,237,0.15)", color: "#c4a5fa",
    fontWeight: 600,
  },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  activeIndicator: {
    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
    width: 4, height: 4, borderRadius: "50%", background: "#7c3aed",
  },
  logoutBtn: {
    margin: "16px 12px 0", padding: "10px 14px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
    color: "#666", cursor: "pointer", fontSize: 13, display: "flex",
    alignItems: "center", gap: 8, transition: "all 0.15s",
  },
};
