import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function AuditPage() {
  const { votes, elections, users } = useData();
  const [search, setSearch] = useState("");
  const [electionFilter, setElectionFilter] = useState("ALL");

  const allLogs = [...votes]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((v) => {
      const election = elections.find((e) => e.id === v.electionId);
      const candidate = election?.candidates.find((c) => c.id === v.candidateId);
      const voter = users.find((u) => u.id === v.userId);
      return { ...v, electionTitle: election?.title, candidateName: candidate?.name, voterName: voter?.name, voterUsername: voter?.username };
    });

  const filtered = allLogs.filter((log) => {
    const matchSearch =
      log.voterName?.toLowerCase().includes(search.toLowerCase()) ||
      log.electionTitle?.toLowerCase().includes(search.toLowerCase()) ||
      log.candidateName?.toLowerCase().includes(search.toLowerCase());
    const matchElection = electionFilter === "ALL" || String(log.electionId) === electionFilter;
    return matchSearch && matchElection;
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Audit Log</h2>
          <p style={styles.subtitle}>{votes.length} total vote records • Admin access only</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: "Total Votes", value: votes.length, color: "#7c3aed" },
          { label: "Active Elections", value: elections.filter(e => e.status === "ACTIVE").length, color: "#2563eb" },
          { label: "Unique Voters", value: [...new Set(votes.map(v => v.userId))].length, color: "#059669" },
          { label: "Participation Rate", value: `${Math.round([...new Set(votes.map(v => v.userId))].length / users.length * 100)}%`, color: "#d97706" },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderColor: s.color + "33" }}>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#666", fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.filters}>
        <div style={styles.searchWrap}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          <input style={styles.search} placeholder="Search by voter, election, or candidate..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={styles.select} value={electionFilter} onChange={e => setElectionFilter(e.target.value)}>
          <option value="ALL">All Elections</option>
          {elections.map(e => <option key={e.id} value={String(e.id)}>{e.title}</option>)}
        </select>
      </div>

      <div style={styles.logTable}>
        <div style={styles.thead}>
          <div style={{ flex: 0.5 }}>#</div>
          <div style={{ flex: 2 }}>Voter</div>
          <div style={{ flex: 2.5 }}>Election</div>
          <div style={{ flex: 2 }}>Candidate</div>
          <div style={{ flex: 1.5 }}>Timestamp</div>
          <div style={{ flex: 1 }}>Vote ID</div>
        </div>
        {filtered.map((log, i) => (
          <div key={log.id} style={styles.trow}>
            <div style={{ flex: 0.5, color: "#555", fontSize: 12 }}>{i + 1}</div>
            <div style={{ flex: 2 }}>
              <div style={styles.voterName}>{log.voterName}</div>
              <div style={styles.voterHandle}>@{log.voterUsername}</div>
            </div>
            <div style={{ flex: 2.5, color: "#ccc", fontSize: 13 }}>{log.electionTitle}</div>
            <div style={{ flex: 2 }}>
              <span style={styles.candidateBadge}>{log.candidateName}</span>
            </div>
            <div style={{ flex: 1.5, color: "#666", fontSize: 12 }}>
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div style={{ flex: 1 }}>
              <code style={styles.voteId}>#{log.id}</code>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>No records found</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 20 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: 10, padding: "14px 16px" },
  filters: { display: "flex", gap: 12, marginBottom: 16 },
  searchWrap: { flex: 1, position: "relative" },
  search: { width: "100%", padding: "9px 14px 9px 36px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" },
  select: { padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#aaa", fontSize: 14, cursor: "pointer", outline: "none" },
  logTable: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" },
  thead: { display: "flex", gap: 16, padding: "12px 20px", background: "rgba(255,255,255,0.04)", color: "#666", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  trow: { display: "flex", gap: 16, padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.04)", alignItems: "center" },
  voterName: { color: "#fff", fontWeight: 600, fontSize: 13 },
  voterHandle: { color: "#666", fontSize: 12 },
  candidateBadge: { padding: "3px 10px", borderRadius: 5, background: "rgba(124,58,237,0.15)", color: "#c4a5fa", fontSize: 12, fontWeight: 500 },
  voteId: { padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "#888", fontSize: 11 },
};
