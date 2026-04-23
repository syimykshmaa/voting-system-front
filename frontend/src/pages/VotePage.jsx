import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function VotePage({ selectedElectionId, onNavigate }) {
  const { elections, castVote, hasVoted, votes } = useData();
  const { currentUser } = useAuth();
  const [selectedElection, setSelectedElection] = useState(selectedElectionId || null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const activeElections = elections.filter((e) => e.status === "ACTIVE" && !hasVoted(currentUser.id, e.id));
  const election = elections.find((e) => e.id === selectedElection);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    try {
      await castVote(currentUser.id, selectedElection, selectedCandidate);
      setSuccess(true);
      setConfirming(false);
    } catch (err) {
      setError(err.message);
      setConfirming(false);
    }
  };

  if (success) {
    const elec = elections.find((e) => e.id === selectedElection);
    const cand = elec?.candidates.find((c) => c.id === selectedCandidate);
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Vote Cast Successfully!</h2>
          <p style={styles.successDesc}>Your vote for <strong style={{ color: "#c4a5fa" }}>{cand?.name}</strong> in "{elec?.title}" has been recorded.</p>
          <p style={{ color: "#555", fontSize: 13 }}>Your vote is anonymous and secure.</p>
          <div style={styles.successActions}>
            <button style={styles.primaryBtn} onClick={() => { setSuccess(false); setSelectedElection(null); setSelectedCandidate(null); }}>
              Vote in Another Election
            </button>
            <button style={styles.secondaryBtn} onClick={() => onNavigate("results", selectedElection)}>
              View Results →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cast Your Vote</h2>
        <p style={styles.subtitle}>{activeElections.length} elections available for you to vote in</p>
      </div>

      {!selectedElection ? (
        <div>
          <h3 style={styles.sectionTitle}>Select an Election</h3>
          {activeElections.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗳</div>
              <div style={{ color: "#aaa" }}>You've voted in all active elections!</div>
              <button style={{ ...styles.primaryBtn, marginTop: 20 }} onClick={() => onNavigate("results")}>View Results</button>
            </div>
          ) : (
            <div style={styles.electionList}>
              {activeElections.map((e) => (
                <div key={e.id} style={styles.electionCard} onClick={() => setSelectedElection(e.id)}>
                  <div style={styles.elecLeft}>
                    <div style={styles.elecIcon}>🗳</div>
                    <div>
                      <div style={styles.elecTitle}>{e.title}</div>
                      <div style={styles.elecDesc}>{e.description}</div>
                      <div style={styles.elecMeta}>{e.candidates.length} candidates • Ends {e.endDate}</div>
                    </div>
                  </div>
                  <div style={styles.elecArrow}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button style={styles.backBtn} onClick={() => { setSelectedElection(null); setSelectedCandidate(null); setError(""); }}>
            ← Back to Elections
          </button>
          <div style={styles.electionBanner}>
            <h3 style={styles.bannerTitle}>{election?.title}</h3>
            <p style={styles.bannerDesc}>{election?.description}</p>
          </div>

          <h3 style={styles.sectionTitle}>Select a Candidate</h3>
          <div style={styles.candidateGrid}>
            {election?.candidates.map((c) => (
              <div key={c.id}
                style={{ ...styles.candidateCard, ...(selectedCandidate === c.id ? styles.candidateSelected : {}) }}
                onClick={() => setSelectedCandidate(c.id)}>
                <div style={styles.candidateCheck}>
                  {selectedCandidate === c.id ? "●" : "○"}
                </div>
                <div style={styles.candidateAvatar}>{c.name.charAt(0)}</div>
                <div style={styles.candidateInfo}>
                  <div style={styles.candidateName}>{c.name}</div>
                  {c.party && <div style={styles.candidateParty}>{c.party}</div>}
                  <div style={styles.candidateBio}>{c.bio}</div>
                </div>
              </div>
            ))}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {confirming ? (
            <div style={styles.confirmBox}>
              <p style={{ color: "#fff", margin: "0 0 16px" }}>
                Confirm your vote for <strong style={{ color: "#c4a5fa" }}>
                  {election?.candidates.find((c) => c.id === selectedCandidate)?.name}
                </strong>?
                <br /><span style={{ color: "#888", fontSize: 13 }}>This action cannot be undone.</span>
              </p>
              <div style={styles.confirmBtns}>
                <button style={styles.primaryBtn} onClick={handleVote}>Yes, Cast My Vote</button>
                <button style={styles.secondaryBtn} onClick={() => setConfirming(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button
              style={{ ...styles.submitBtn, opacity: selectedCandidate ? 1 : 0.4 }}
              disabled={!selectedCandidate}
              onClick={() => setConfirming(true)}>
              Submit Vote →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 800, margin: "0 auto" },
  header: { marginBottom: 28 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  sectionTitle: { color: "#aaa", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 },
  electionList: { display: "flex", flexDirection: "column", gap: 10 },
  electionCard: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px", borderRadius: 12,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer", transition: "all 0.15s",
  },
  elecLeft: { display: "flex", gap: 14, alignItems: "center" },
  elecIcon: { fontSize: 24, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.15)", borderRadius: 10 },
  elecTitle: { color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 },
  elecDesc: { color: "#777", fontSize: 13, marginBottom: 4 },
  elecMeta: { color: "#555", fontSize: 12 },
  elecArrow: { color: "#7c3aed", fontSize: 18, fontWeight: 700 },
  backBtn: { background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "0 0 16px", display: "block" },
  electionBanner: { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 },
  bannerTitle: { color: "#c4a5fa", fontSize: 16, fontWeight: 700, margin: "0 0 6px" },
  bannerDesc: { color: "#888", fontSize: 13, margin: 0 },
  candidateGrid: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  candidateCard: {
    display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px",
    borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.15s",
  },
  candidateSelected: {
    background: "rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.4)",
  },
  candidateCheck: { color: "#7c3aed", fontSize: 18, marginTop: 2, flexShrink: 0 },
  candidateAvatar: {
    width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed44, #2563eb44)",
    color: "#c4a5fa", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  candidateInfo: {},
  candidateName: { color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 2 },
  candidateParty: { color: "#7c3aed", fontSize: 12, fontWeight: 600, marginBottom: 4 },
  candidateBio: { color: "#777", fontSize: 13 },
  error: { padding: "12px 16px", borderRadius: 8, background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.3)", color: "#e74c3c", fontSize: 13, marginBottom: 16 },
  submitBtn: {
    padding: "14px 32px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 15, fontWeight: 700, cursor: "pointer", display: "block",
  },
  confirmBox: { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: 20 },
  confirmBtns: { display: "flex", gap: 10 },
  primaryBtn: {
    padding: "10px 22px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 22px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "#aaa", fontSize: 13, cursor: "pointer",
  },
  successCard: {
    maxWidth: 460, margin: "60px auto 0", textAlign: "center",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "44px 36px",
  },
  successIcon: {
    width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
    color: "#fff", fontSize: 32, fontWeight: 900, boxShadow: "0 8px 32px rgba(5,150,105,0.4)",
  },
  successTitle: { color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 12px" },
  successDesc: { color: "#888", fontSize: 14, lineHeight: 1.6, margin: "0 0 8px" },
  successActions: { display: "flex", gap: 12, justifyContent: "center", marginTop: 24 },
  emptyState: { textAlign: "center", padding: 60 },
};
