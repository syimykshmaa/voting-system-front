import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function ResultsPage({ selectedElectionId }) {
  const { elections, getElectionResults, votes } = useData();
  const [selected, setSelected] = useState(selectedElectionId || elections[0]?.id);

  const data = selected ? getElectionResults(selected) : null;

  const maxVotes = data ? Math.max(...data.results.map((r) => r.voteCount), 1) : 1;
  const winner = data?.results.reduce((a, b) => (a.voteCount > b.voteCount ? a : b), data.results[0]);

  const COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Election Results</h2>
        <p style={styles.subtitle}>Real-time vote tallies and analytics</p>
      </div>

      <div style={styles.selectorRow}>
        {elections.map((e) => (
          <button
            key={e.id}
            style={{ ...styles.selectorBtn, ...(selected === e.id ? styles.selectorActive : {}) }}
            onClick={() => setSelected(e.id)}>
            {e.title}
            <span style={{ ...styles.statusDot, background: e.status === "ACTIVE" ? "#2ecc71" : e.status === "COMPLETED" ? "#888" : "#f39c12" }} />
          </button>
        ))}
      </div>

      {data && (
        <div style={styles.content}>
          <div style={styles.overviewCards}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.totalVotes}</div>
              <div style={styles.statLabel}>Total Votes Cast</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.election.candidates.length}</div>
              <div style={styles.statLabel}>Candidates</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: "#c4a5fa" }}>{winner?.name.split(" ")[0]}</div>
              <div style={styles.statLabel}>Leading</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: data.election.status === "ACTIVE" ? "#2ecc71" : "#888" }}>
                {data.election.status}
              </div>
              <div style={styles.statLabel}>Status</div>
            </div>
          </div>

          <div style={styles.mainGrid}>
            <div style={styles.chartPanel}>
              <h3 style={styles.panelTitle}>Vote Distribution</h3>
              <div style={styles.bars}>
                {[...data.results]
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .map((r, i) => {
                    const pct = data.totalVotes > 0 ? (r.voteCount / data.totalVotes * 100).toFixed(1) : 0;
                    const barPct = (r.voteCount / maxVotes * 100).toFixed(1);
                    const color = COLORS[i % COLORS.length];
                    const isWinner = r.id === winner?.id && data.totalVotes > 0;
                    return (
                      <div key={r.id} style={styles.barItem}>
                        <div style={styles.barHeader}>
                          <div style={styles.barName}>
                            {isWinner && <span style={styles.crown}>👑</span>}
                            <span>{r.name}</span>
                            {r.party && <span style={{ ...styles.partyTag, color, background: color + "22" }}>{r.party}</span>}
                          </div>
                          <div style={styles.barStats}>
                            <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                            <span style={{ color: "#555", marginLeft: 8 }}>{r.voteCount} votes</span>
                          </div>
                        </div>
                        <div style={styles.barTrack}>
                          <div style={{ ...styles.barFill, width: `${barPct}%`, background: color, boxShadow: `0 0 12px ${color}66` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div style={styles.sidePanel}>
              <h3 style={styles.panelTitle}>Donut Chart</h3>
              <div style={styles.donutWrap}>
                <svg viewBox="0 0 100 100" style={{ width: 180, height: 180 }}>
                  {(() => {
                    let offset = 0;
                    const total = data.totalVotes || 1;
                    return data.results.map((r, i) => {
                      const frac = r.voteCount / total;
                      const dash = frac * 282.7;
                      const gap = 282.7 - dash;
                      const rotate = offset * 360;
                      offset += frac;
                      return (
                        <circle key={r.id} cx="50" cy="50" r="45"
                          fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="10"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset="70.7"
                          transform={`rotate(${rotate - 90} 50 50)`}
                          style={{ transition: "all 0.5s" }}
                        />
                      );
                    });
                  })()}
                  <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">{data.totalVotes}</text>
                  <text x="50" y="58" textAnchor="middle" fill="#888" fontSize="6">VOTES</text>
                </svg>
                <div style={styles.legend}>
                  {data.results.map((r, i) => (
                    <div key={r.id} style={styles.legendItem}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: "#aaa", fontSize: 12 }}>{r.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {data.election.status === "COMPLETED" && winner && data.totalVotes > 0 && (
            <div style={styles.winnerBanner}>
              <div style={{ fontSize: 28 }}>🏆</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Winner: {winner.name}</div>
                <div style={{ color: "#888", fontSize: 13 }}>
                  {winner.voteCount} votes · {(winner.voteCount / data.totalVotes * 100).toFixed(1)}% of total votes
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  header: { marginBottom: 24 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  selectorRow: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  selectorBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "#777", cursor: "pointer", fontSize: 13,
    display: "flex", alignItems: "center", gap: 8, fontWeight: 500,
  },
  selectorActive: { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.4)", color: "#c4a5fa" },
  statusDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  content: {},
  overviewCards: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  statCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "16px 18px",
  },
  statValue: { color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 4 },
  statLabel: { color: "#666", fontSize: 12, fontWeight: 500 },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 },
  chartPanel: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 },
  sidePanel: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 },
  panelTitle: { color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 20px" },
  bars: { display: "flex", flexDirection: "column", gap: 18 },
  barItem: {},
  barHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  barName: { display: "flex", alignItems: "center", gap: 6, color: "#ddd", fontSize: 14, fontWeight: 600 },
  crown: { fontSize: 14 },
  partyTag: { padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 },
  barStats: { color: "#aaa", fontSize: 13 },
  barTrack: { height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" },
  donutWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  legend: { display: "flex", flexDirection: "column", gap: 6, width: "100%" },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },
  winnerBanner: {
    display: "flex", alignItems: "center", gap: 16, marginTop: 16, padding: "16px 20px",
    background: "rgba(253,224,71,0.08)", border: "1px solid rgba(253,224,71,0.2)", borderRadius: 12,
  },
};
