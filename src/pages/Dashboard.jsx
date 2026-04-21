import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{ ...cardStyles.card, borderColor: color + "33" }}>
    <div style={{ ...cardStyles.icon, background: color + "22", color }}>{icon}</div>
    <div style={cardStyles.value}>{value}</div>
    <div style={cardStyles.label}>{label}</div>
    {sub && <div style={cardStyles.sub}>{sub}</div>}
  </div>
);

const cardStyles = {
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid",
    borderRadius: 14, padding: "20px", minWidth: 0,
  },
  icon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 },
  value: { color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1 },
  label: { color: "#888", fontSize: 13, marginTop: 6, fontWeight: 500 },
  sub: { color: "#555", fontSize: 12, marginTop: 4 },
};

export default function Dashboard({ onNavigate }) {
  const { currentUser, hasRole } = useAuth();
  const { elections, votes, users } = useData();

  const activeElections = elections.filter((e) => e.status === "ACTIVE").length;
  const totalVotes = votes.length;
  const userVotes = votes.filter((v) => v.userId === currentUser.id).length;

  const recentActivity = [...votes]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Welcome back, {currentUser.name.split(" ")[0]} 👋</h2>
          <p style={styles.subtitle}>Here's what's happening in your voting system</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Active Elections" value={activeElections} sub="Currently running" color="#7c3aed" icon="🗳" />
        <StatCard label="Total Elections" value={elections.length} sub="All time" color="#2563eb" icon="◉" />
        {hasRole("ADMIN", "MANAGER") ? (
          <>
            <StatCard label="Total Votes Cast" value={totalVotes} sub="System-wide" color="#059669" icon="✓" />
            <StatCard label="Registered Users" value={users.length} sub="Active members" color="#d97706" icon="◎" />
          </>
        ) : (
          <>
            <StatCard label="My Votes" value={userVotes} sub="Elections participated" color="#059669" icon="✓" />
            <StatCard label="Pending Votes" value={activeElections - userVotes} sub="Awaiting your vote" color="#d97706" icon="!" />
          </>
        )}
      </div>

      <div style={styles.twoCol}>
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Active Elections</h3>
          <div style={styles.list}>
            {elections.filter((e) => e.status === "ACTIVE").map((e) => (
              <div key={e.id} style={styles.listItem}>
                <div style={styles.elecDot} />
                <div style={{ flex: 1 }}>
                  <div style={styles.elecName}>{e.title}</div>
                  <div style={styles.elecDate}>Ends: {e.endDate}</div>
                </div>
                <span style={styles.activeBadge}>LIVE</span>
              </div>
            ))}
            {elections.filter((e) => e.status === "ACTIVE").length === 0 && (
              <div style={{ color: "#555", fontSize: 13, padding: "12px 0" }}>No active elections</div>
            )}
          </div>
          <button style={styles.viewAllBtn} onClick={() => onNavigate("elections")}>View All Elections →</button>
        </div>

        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Recent Activity</h3>
          <div style={styles.list}>
            {recentActivity.map((vote) => {
              const election = elections.find((e) => e.id === vote.electionId);
              const candidate = election?.candidates.find((c) => c.id === vote.candidateId);
              const voter = users.find((u) => u.id === vote.userId);
              return (
                <div key={vote.id} style={styles.activityItem}>
                  <div style={styles.activityDot} />
                  <div>
                    <div style={styles.activityText}>
                      {hasRole("ADMIN", "MANAGER") ? (voter?.name || "User") : "Anonymous"} voted
                    </div>
                    <div style={styles.activitySub}>{election?.title} • {candidate?.name}</div>
                    <div style={styles.activityTime}>{new Date(vote.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {hasRole("ADMIN", "MANAGER") && (
        <div style={styles.quickActions}>
          <h3 style={styles.panelTitle}>Quick Actions</h3>
          <div style={styles.actions}>
            <button style={{ ...styles.actionBtn, background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.3)", color: "#c4a5fa" }}
              onClick={() => onNavigate("manage-elections")}>
              ⚙ Manage Elections
            </button>
            {hasRole("ADMIN") && (
              <button style={{ ...styles.actionBtn, background: "rgba(37,99,235,0.15)", borderColor: "rgba(37,99,235,0.3)", color: "#93c5fd" }}
                onClick={() => onNavigate("users")}>
                ◎ Manage Users
              </button>
            )}
            <button style={{ ...styles.actionBtn, background: "rgba(5,150,105,0.15)", borderColor: "rgba(5,150,105,0.3)", color: "#6ee7b7" }}
              onClick={() => onNavigate("results")}>
              ◉ View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.3px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  dateBadge: { padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", color: "#888", fontSize: 13, border: "1px solid rgba(255,255,255,0.08)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
  panel: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  panelTitle: { color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.2px" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  listItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  elecDot: { width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 },
  elecName: { color: "#e0e0e0", fontSize: 13, fontWeight: 600 },
  elecDate: { color: "#666", fontSize: 12, marginTop: 2 },
  activeBadge: { padding: "2px 8px", borderRadius: 4, background: "rgba(5,150,105,0.2)", color: "#6ee7b7", fontSize: 10, fontWeight: 700 },
  viewAllBtn: { marginTop: 12, background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 },
  activityItem: { display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  activityDot: { width: 6, height: 6, borderRadius: "50%", background: "#2563eb", marginTop: 6, flexShrink: 0 },
  activityText: { color: "#ccc", fontSize: 13, fontWeight: 500 },
  activitySub: { color: "#666", fontSize: 12, marginTop: 2 },
  activityTime: { color: "#444", fontSize: 11, marginTop: 2 },
  quickActions: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  actions: { display: "flex", gap: 12, flexWrap: "wrap" },
  actionBtn: { padding: "10px 20px", borderRadius: 8, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" },
};
