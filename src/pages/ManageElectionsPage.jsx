import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  title: "", description: "", startDate: "", endDate: "",
  candidates: [{ id: Date.now(), name: "", party: "", bio: "" }],
};

export default function ManageElectionsPage() {
  const { elections, createElection, updateElection, deleteElection, votes } = useData();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (e) => {
    setForm({ title: e.title, description: e.description, startDate: e.startDate, endDate: e.endDate, candidates: [...e.candidates] });
    setEditId(e.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title || !form.startDate || !form.endDate) return;
    if (editId) {
      updateElection(editId, form);
      setSuccessMsg("Election updated!");
    } else {
      createElection(form, currentUser.id);
      setSuccessMsg("Election created!");
    }
    setShowForm(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    deleteElection(id);
    setConfirmDelete(null);
    setSuccessMsg("Election deleted.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleStatusChange = (id, status) => {
    updateElection(id, { status });
    setSuccessMsg("Status updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const addCandidate = () => setForm(f => ({ ...f, candidates: [...f.candidates, { id: Date.now(), name: "", party: "", bio: "" }] }));
  const removeCandidate = (cid) => setForm(f => ({ ...f, candidates: f.candidates.filter(c => c.id !== cid) }));
  const updateCandidate = (cid, field, val) => setForm(f => ({ ...f, candidates: f.candidates.map(c => c.id === cid ? { ...c, [field]: val } : c) }));

  const STATUS_TRANSITIONS = { DRAFT: ["ACTIVE"], ACTIVE: ["COMPLETED"], COMPLETED: [] };
  const STATUS_COLOR = { ACTIVE: "#2ecc71", COMPLETED: "#888", DRAFT: "#f39c12" };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Manage Elections</h2>
          <p style={styles.subtitle}>Create, edit, and control election lifecycle</p>
        </div>
        <button style={styles.createBtn} onClick={openCreate}>+ New Election</button>
      </div>

      {successMsg && <div style={styles.successMsg}>{successMsg}</div>}

      {showForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>{editId ? "Edit Election" : "Create New Election"}</h3>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div style={styles.formBody}>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Title *</label>
                <input style={styles.formInput} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Election title" />
              </div>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Description</label>
                <textarea style={{ ...styles.formInput, minHeight: 80, resize: "vertical" }} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description..." />
              </div>
              <div style={styles.twoCol}>
                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Start Date *</label>
                  <input type="date" style={styles.formInput} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div style={styles.formRow}>
                  <label style={styles.formLabel}>End Date *</label>
                  <input type="date" style={styles.formInput} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>

              <div style={styles.candidatesSection}>
                <div style={styles.candidatesHeader}>
                  <label style={styles.formLabel}>Candidates</label>
                  <button style={styles.addCandBtn} onClick={addCandidate}>+ Add</button>
                </div>
                {form.candidates.map((c, i) => (
                  <div key={c.id} style={styles.candidateRow}>
                    <div style={styles.candNum}>{i + 1}</div>
                    <input style={{ ...styles.formInput, flex: 1 }} placeholder="Name" value={c.name} onChange={e => updateCandidate(c.id, "name", e.target.value)} />
                    <input style={{ ...styles.formInput, flex: 1 }} placeholder="Party (opt)" value={c.party} onChange={e => updateCandidate(c.id, "party", e.target.value)} />
                    <input style={{ ...styles.formInput, flex: 2 }} placeholder="Bio (opt)" value={c.bio} onChange={e => updateCandidate(c.id, "bio", e.target.value)} />
                    {form.candidates.length > 1 && (
                      <button style={styles.removeCandBtn} onClick={() => removeCandidate(c.id)}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.formFooter}>
              <button style={styles.saveBtn} onClick={handleSave}>{editId ? "Save Changes" : "Create Election"}</button>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={styles.formOverlay}>
          <div style={{ ...styles.formCard, maxWidth: 400 }}>
            <h3 style={{ color: "#fff", marginTop: 0 }}>Confirm Delete</h3>
            <p style={{ color: "#aaa" }}>Delete "<strong style={{ color: "#fff" }}>{elections.find(e => e.id === confirmDelete)?.title}</strong>"? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.saveBtn, background: "#dc2626" }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button style={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={{ flex: 3 }}>Election</div>
          <div style={{ flex: 1 }}>Status</div>
          <div style={{ flex: 1 }}>Candidates</div>
          <div style={{ flex: 1 }}>Votes</div>
          <div style={{ flex: 1 }}>Dates</div>
          <div style={{ flex: 1.5 }}>Actions</div>
        </div>
        {elections.map((e) => (
          <div key={e.id} style={styles.tableRow}>
            <div style={{ flex: 3 }}>
              <div style={styles.elecName}>{e.title}</div>
              <div style={styles.elecDesc}>{e.description}</div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ ...styles.statusBadge, color: STATUS_COLOR[e.status], background: STATUS_COLOR[e.status] + "22" }}>{e.status}</span>
            </div>
            <div style={{ flex: 1, color: "#aaa", fontSize: 13 }}>{e.candidates.length}</div>
            <div style={{ flex: 1, color: "#aaa", fontSize: 13 }}>{votes.filter(v => v.electionId === e.id).length}</div>
            <div style={{ flex: 1, color: "#666", fontSize: 12 }}>
              <div>{e.startDate}</div>
              <div>{e.endDate}</div>
            </div>
            <div style={{ flex: 1.5, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button style={styles.actionBtn} onClick={() => openEdit(e)}>Edit</button>
              {STATUS_TRANSITIONS[e.status]?.map(next => (
                <button key={next} style={{ ...styles.actionBtn, color: STATUS_COLOR[next], borderColor: STATUS_COLOR[next] + "55" }}
                  onClick={() => handleStatusChange(e.id, next)}>→ {next}</button>
              ))}
              <button style={{ ...styles.actionBtn, color: "#e74c3c", borderColor: "#e74c3c55" }}
                onClick={() => setConfirmDelete(e.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "#666", fontSize: 14, margin: 0 },
  createBtn: {
    padding: "10px 20px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  successMsg: { padding: "12px 16px", borderRadius: 8, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", color: "#6ee7b7", fontSize: 13, marginBottom: 16 },
  formOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  formCard: { background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  formTitle: { color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 },
  formBody: { display: "flex", flexDirection: "column", gap: 16 },
  formRow: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: { color: "#aaa", fontSize: 13, fontWeight: 500 },
  formInput: {
    padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none",
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  candidatesSection: { display: "flex", flexDirection: "column", gap: 8 },
  candidatesHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  addCandBtn: { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4a5fa", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  candidateRow: { display: "flex", gap: 8, alignItems: "center" },
  candNum: { width: 24, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "#777", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 },
  removeCandBtn: { background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: 16, padding: "0 4px" },
  formFooter: { display: "flex", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" },
  saveBtn: {
    padding: "10px 24px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
    fontSize: 14, fontWeight: 700, cursor: "pointer",
  },
  cancelBtn: { padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#aaa", fontSize: 14, cursor: "pointer" },
  table: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" },
  tableHeader: { display: "flex", gap: 16, padding: "12px 20px", background: "rgba(255,255,255,0.04)", color: "#666", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  tableRow: { display: "flex", gap: 16, padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", alignItems: "center" },
  elecName: { color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 3 },
  elecDesc: { color: "#666", fontSize: 12 },
  statusBadge: { padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700 },
  actionBtn: { padding: "5px 10px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 12, fontWeight: 600 },
};
