import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reviewer" });
  const [submitting, setSubmitting] = useState(false);
  const [patchingId, setPatchingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data || []);
    } catch {
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/users/", form);
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "reviewer" });
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const patch = async (id, payload) => {
    try {
      setPatchingId(id);
      await api.patch(`/users/${id}`, payload);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Update failed.");
    } finally {
      setPatchingId(null);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed.");
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="dash-hero">
        <img
          className="dash-hero-img"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
          alt="Team collaboration"
        />
        <div className="dash-hero-overlay">
          <p className="dash-hero-eyebrow">Travel Agent · Admin</p>
          <div className="dash-hero-tags">
            <span className="dash-hero-tag"><i className="ti ti-users" /> User Management</span>
            <span className="dash-hero-tag"><i className="ti ti-shield-check" /> Roles & Access</span>
          </div>
          <h1 className="dash-hero-title">Manage Users</h1>
          <p className="dash-hero-sub">
            View, create, and manage admin and reviewer accounts.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-page-toolbar">
        <button className="adm-btn-primary" onClick={() => setShowModal(true)}>
          <i className="ti ti-user-plus" /> Add New User
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="dash-loading"><i className="ti ti-loader-2" /> Loading users…</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="adm-td-name">
                    <div className="adm-avatar-sm">{u.name.slice(0, 2).toUpperCase()}</div>
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="adm-select-inline"
                      value={u.role}
                      disabled={patchingId === u.id}
                      onChange={(e) => patch(u.id, { role: e.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="reviewer">Reviewer</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className={`adm-status-toggle ${u.is_active ? "active" : "inactive"}`}
                      disabled={patchingId === u.id}
                      onClick={() => patch(u.id, { is_active: !u.is_active })}
                    >
                      {u.is_active ? (
                        <><i className="ti ti-circle-check" /> Active</>
                      ) : (
                        <><i className="ti ti-circle-x" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="adm-td-muted">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <button
                      className="adm-btn-danger-sm"
                      onClick={() => deleteUser(u.id, u.name)}
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="adm-empty">No users found.</div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="adm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2><i className="ti ti-user-plus" /> Create New User</h2>
              <button className="adm-modal-close" onClick={() => setShowModal(false)}>
                <i className="ti ti-x" />
              </button>
            </div>
            <form className="adm-modal-form" onSubmit={createUser}>
              <label>
                <span>Full Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </label>
              <label>
                <span>Role</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="adm-modal-footer">
                <button type="submit" className="adm-btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </button>
                <button type="button" className="adm-btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
