import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const STATUS_CONFIG = {
  ACTIVE: { color: "#2ecc71", bg: "rgba(46,204,113,0.15)", label: "Active" },
  COMPLETED: { color: "#888", bg: "rgba(136,136,136,0.15)", label: "Completed" },
  DRAFT: { color: "#f39c12", bg: "rgba(243,156,18,0.15)", label: "Draft" },
};

export default function ElectionsPage({ onNavigate }) {
  const { elections, votes } = useData();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");

  const filtered = elections
    .filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const hasVoted = (electionId) => votes.some((v) => v.userId === currentUser.id && v.electionId === electionId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Elections</h2>
          <p style={styles.subtitle}>{elections.length} total elections • {elections.filter((e) => e.status === "ACTIVE").length} active</p>
        </div>
      </div>

      <div style={styles.filters}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.search}
            placeholder="Search elections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.filterBtns}>
          {["ALL", "ACTIVE", "COMPLETED", "DRAFT"].map((s) => (
            <button key={s} style={{ ...styles.filterBtn, ...(statusFilter === s ? styles.filterBtnActive : {}) }}
              onClick={() => setStatusFilter(s)}>
              {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
        <select style={styles.sort} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filtered.map((election) => {
          const cfg = STATUS_CONFIG[election.status];
          const voteCount = votes.filter((v) => v.electionId === election.id).length;
          const voted = hasVoted(election.id);

          return (
            <div key={election.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={{ ...styles.statusBadge, color: cfg.color, background: cfg.bg }}>
                  {cfg.label}
                </span>
                {voted && <span style={styles.votedBadge}>✓ Voted</span>}
              </div>
              <h3 style={styles.cardTitle}>{election.title}</h3>
              <p style={styles.cardDesc}>{election.description}</p>
              <div style={styles.cardMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>📅</span>
                  <span>{election.startDate} – {election.endDate}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>◎</span>
                  <span>{election.candidates.length} candidates</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>✓</span>
                  <span>{voteCount} votes cast</span>
                </div>
              </div>
              <div style={styles.cardFooter}>
                {election.status === "ACTIVE" && !voted && (
                  <button style={styles.voteBtn} onClick={() => onNavigate("vote", election.id)}>
                    Vote Now →
                  </button>
                )}
                <button style={styles.resultsBtn} onClick={() => onNavigate("results", election.id)}>
                  View Results
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: 40 }}>🗳</div>
          <div style={{ color: "#555", marginTop: 12 }}>No elections found</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  filters: { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" },
  searchWrap: { flex: 1, minWidth: 200, position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 },
  search: {
    width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
    color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  filterBtns: { display: "flex", gap: 6 },
  filterBtn: {
    padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "#777", cursor: "pointer", fontSize: 13, fontWeight: 500,
  },
  filterBtnActive: { background: "rgba(124,58,237,0.2)", borderColor: "rgba(124,58,237,0.4)", color: "#c4a5fa" },
  sort: {
    padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)", color: "#aaa", fontSize: 13, cursor: "pointer", outline: "none",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 0,
    transition: "border-color 0.2s",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  statusBadge: { padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" },
  votedBadge: { padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "rgba(5,150,105,0.2)", color: "#6ee7b7" },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 },
  cardDesc: { color: "#777", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 },
  cardMeta: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  metaItem: { display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 12 },
  metaIcon: { fontSize: 12 },
  cardFooter: { display: "flex", gap: 8, marginTop: "auto" },
  voteBtn: {
    flex: 1, padding: "9px", borderRadius: 7, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  resultsBtn: {
    flex: 1, padding: "9px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "#aaa", fontSize: 13, cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "60px 0" },
};
