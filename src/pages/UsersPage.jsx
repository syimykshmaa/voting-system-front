import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const ROLE_COLOR = { ADMIN: "#e74c3c", MANAGER: "#f39c12", USER: "#2ecc71" };

export default function UsersPage() {
  const { users, addUser, deleteUser, updateUser, votes } = useData();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "USER" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [msg, setMsg] = useState("");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openCreate = () => { setForm({ name: "", username: "", email: "", password: "", role: "USER" }); setEditUser(null); setShowForm(true); };
  const openEdit = (u) => { setForm({ name: u.name, username: u.username, email: u.email, password: u.password, role: u.role }); setEditUser(u); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.username || !form.email) return;
    if (editUser) { updateUser(editUser.id, form); setMsg("User updated!"); }
    else { addUser(form); setMsg("User created!"); }
    setShowForm(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = (id) => {
    deleteUser(id); setConfirmDelete(null); setMsg("User deleted.");
    setTimeout(() => setMsg(""), 3000);
  };

  const getUserVoteCount = (uid) => votes.filter((v) => v.userId === uid).length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>User Management</h2>
          <p style={styles.subtitle}>{users.length} registered users</p>
        </div>
        <button style={styles.createBtn} onClick={openCreate}>+ Add User</button>
      </div>

      {msg && <div style={styles.successMsg}>{msg}</div>}

      <div style={styles.filters}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input style={styles.search} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={styles.filterBtns}>
          {["ALL", "ADMIN", "MANAGER", "USER"].map(r => (
            <button key={r} style={{ ...styles.filterBtn, ...(roleFilter === r ? styles.filterActive : {}) }} onClick={() => setRoleFilter(r)}>{r}</button>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ color: "#fff", margin: 0 }}>{editUser ? "Edit User" : "Add User"}</h3>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div style={styles.formGrid}>
              {[["Name *", "name", "text"], ["Username *", "username", "text"], ["Email *", "email", "email"], ["Password", "password", "password"]].map(([label, key, type]) => (
                <div key={key}>
                  <label style={styles.formLabel}>{label}</label>
                  <input type={type} style={styles.formInput} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={label.replace(" *", "")} />
                </div>
              ))}
              <div>
                <label style={styles.formLabel}>Role</label>
                <select style={styles.formInput} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.saveBtn} onClick={handleSave}>{editUser ? "Save" : "Create"}</button>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: 380 }}>
            <h3 style={{ color: "#fff", marginTop: 0 }}>Delete User?</h3>
            <p style={{ color: "#aaa" }}>Delete <strong style={{ color: "#fff" }}>{users.find(u => u.id === confirmDelete)?.name}</strong>? This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.saveBtn, background: "#dc2626" }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button style={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.table}>
        <div style={styles.thead}>
          <div style={{ flex: 2 }}>User</div>
          <div style={{ flex: 1 }}>Role</div>
          <div style={{ flex: 1.5 }}>Email</div>
          <div style={{ flex: 1 }}>Votes Cast</div>
          <div style={{ flex: 1 }}>Joined</div>
          <div style={{ flex: 1 }}>Actions</div>
        </div>
        {filtered.map(u => (
          <div key={u.id} style={styles.trow}>
            <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ ...styles.avatar, background: `${ROLE_COLOR[u.role]}33`, color: ROLE_COLOR[u.role] }}>{u.name.charAt(0)}</div>
              <div>
                <div style={styles.userName}>{u.name} {u.id === currentUser.id && <span style={styles.youTag}>You</span>}</div>
                <div style={styles.userHandle}>@{u.username}</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ ...styles.roleBadge, color: ROLE_COLOR[u.role], background: ROLE_COLOR[u.role] + "22" }}>{u.role}</span>
            </div>
            <div style={{ flex: 1.5, color: "#777", fontSize: 13 }}>{u.email}</div>
            <div style={{ flex: 1, color: "#aaa", fontSize: 13 }}>{getUserVoteCount(u.id)}</div>
            <div style={{ flex: 1, color: "#666", fontSize: 12 }}>{u.createdAt}</div>
            <div style={{ flex: 1, display: "flex", gap: 6 }}>
              <button style={styles.actionBtn} onClick={() => openEdit(u)}>Edit</button>
              {u.id !== currentUser.id && (
                <button style={{ ...styles.actionBtn, color: "#e74c3c", borderColor: "#e74c3c55" }} onClick={() => setConfirmDelete(u.id)}>Del</button>
              )}
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
  createBtn: { padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  successMsg: { padding: "12px 16px", borderRadius: 8, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", color: "#6ee7b7", fontSize: 13, marginBottom: 16 },
  filters: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  searchWrap: { flex: 1, minWidth: 200, position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 },
  search: { width: "100%", padding: "9px 14px 9px 36px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" },
  filterBtns: { display: "flex", gap: 6 },
  filterBtn: { padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#777", cursor: "pointer", fontSize: 13 },
  filterActive: { background: "rgba(124,58,237,0.2)", borderColor: "rgba(124,58,237,0.4)", color: "#c4a5fa" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500 },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  closeBtn: { background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 },
  formLabel: { color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" },
  formInput: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" },
  modalFooter: { display: "flex", gap: 10 },
  saveBtn: { padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#aaa", fontSize: 14, cursor: "pointer" },
  table: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" },
  thead: { display: "flex", gap: 16, padding: "12px 20px", background: "rgba(255,255,255,0.04)", color: "#666", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  trow: { display: "flex", gap: 16, padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 },
  userName: { color: "#fff", fontWeight: 600, fontSize: 14 },
  userHandle: { color: "#666", fontSize: 12 },
  youTag: { display: "inline-block", padding: "1px 6px", borderRadius: 4, background: "rgba(124,58,237,0.2)", color: "#c4a5fa", fontSize: 10, fontWeight: 700, marginLeft: 6 },
  roleBadge: { padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700 },
  actionBtn: { padding: "5px 10px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 12, fontWeight: 600 },
};
