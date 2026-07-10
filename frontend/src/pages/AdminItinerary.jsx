import { useEffect, useState } from "react";
import api from "../api/client";

const COLOR_OPTIONS = [
  { value: "dest-amsterdam",    label: "🟩 Teal (Amsterdam)" },
  { value: "dest-paris",        label: "🟪 Pink (Paris)" },
  { value: "dest-keukenhof",    label: "🟧 Orange (Keukenhof)" },
  { value: "dest-mini",         label: "🟨 Dark (Mini Europe)" },
  { value: "dest-giethoorn",    label: "🟦 Blue (Giethoorn)" },
  { value: "dest-scheveningen", label: "🟪 Purple (Scheveningen)" },
  { value: "dest-depart",       label: "⬛ Dark Slate (Departure)" },
];

const EMPTY_DAY = {
  day_label: "",
  destination: "",
  activities: "",      // comma-separated in the form
  color_class: "dest-amsterdam",
  sort_order: 99,
  is_active: true,
};

function parseActivities(raw) {
  if (Array.isArray(raw)) return raw.join("\n");
  return raw || "";
}

function toActivitiesArray(raw) {
  return raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminItinerary() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // { id, ...draft }  (null = closed)
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/itinerary/all");
      setDays(res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Unknown error";
      const status = err?.response?.status || "network";
      alert(`Failed to load itinerary.\nStatus: ${status}\nDetail: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ ...EMPTY_DAY, activities: "" });
    setIsNew(true);
  };

  const openEdit = (day) => {
    setEditing({
      id: day.id,
      day_label: day.day_label,
      destination: day.destination,
      activities: parseActivities(day.activities),
      color_class: day.color_class,
      sort_order: day.sort_order,
      is_active: day.is_active,
    });
    setIsNew(false);
  };

  const closeModal = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    const { id, activities: rawActivities, ...rest } = editing;
    const payload = { ...rest, activities: toActivitiesArray(rawActivities) };

    try {
      setSaving(true);
      if (isNew) {
        await api.post("/itinerary/", payload);
      } else {
        await api.put(`/itinerary/${id}`, payload);
      }
      closeModal();
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id) => {
    try {
      setTogglingId(id);
      const res = await api.patch(`/itinerary/${id}/toggle`);
      setDays((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_active: res.data.is_active } : d))
      );
    } catch {
      alert("Toggle failed.");
    } finally {
      setTogglingId(null);
    }
  };

  const deleteDay = async (id, destination) => {
    if (!window.confirm(`Delete "${destination}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await api.delete(`/itinerary/${id}`);
      setDays((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="dash-hero">
        <img
          className="dash-hero-img"
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
          alt="European travel"
        />
        <div className="dash-hero-overlay">
          <p className="dash-hero-eyebrow">Travel Agent · Admin</p>
          <div className="dash-hero-tags">
            <span className="dash-hero-tag"><i className="ti ti-map" /> Itinerary</span>
            <span className="dash-hero-tag"><i className="ti ti-calendar" /> Day-by-Day</span>
          </div>
          <h1 className="dash-hero-title">Edit Itinerary</h1>
          <p className="dash-hero-sub">
            Add, edit, reorder or remove days from the public-facing trip itinerary.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-page-toolbar">
        <span className="adm-itin-count">
          <b>{days.filter((d) => d.is_active).length}</b> active days · <b>{days.length}</b> total
        </span>
        <button className="adm-btn-primary" onClick={openNew}>
          <i className="ti ti-plus" /> Add Day
        </button>
      </div>

      {/* Days list */}
      {loading ? (
        <div className="dash-loading"><i className="ti ti-loader-2" /> Loading itinerary…</div>
      ) : (
        <div className="adm-itin-list">
          {days.length === 0 && (
            <div className="adm-empty">No itinerary days yet. Click "Add Day" to get started.</div>
          )}
          {days.map((day) => (
            <div key={day.id} className={`adm-itin-row ${!day.is_active ? "adm-itin-inactive" : ""}`}>
              {/* Colour pill preview */}
              <div className={`adm-itin-color-pill itin-pill-${day.color_class}`} />

              <div className="adm-itin-info">
                <div className="adm-itin-header">
                  <span className="adm-itin-label">{day.day_label}</span>
                  <span className="adm-itin-dest">{day.destination}</span>
                  <span className="adm-itin-order">#{day.sort_order}</span>
                  {!day.is_active && (
                    <span className="adm-badge adm-badge-gray">Hidden</span>
                  )}
                </div>
                <div className="adm-itin-activities">
                  {(day.activities || []).map((a, i) => (
                    <span key={i} className="adm-act-chip">{a}</span>
                  ))}
                </div>
              </div>

              <div className="adm-itin-actions">
                <button
                  className="adm-btn-edit"
                  onClick={() => openEdit(day)}
                >
                  <i className="ti ti-pencil" /> Edit
                </button>
                <button
                  className={`adm-status-toggle ${day.is_active ? "active" : "inactive"}`}
                  disabled={togglingId === day.id}
                  onClick={() => toggle(day.id)}
                  title={day.is_active ? "Hide from public site" : "Show on public site"}
                >
                  {day.is_active ? (
                    <><i className="ti ti-eye" /> Visible</>
                  ) : (
                    <><i className="ti ti-eye-off" /> Hidden</>
                  )}
                </button>
                <button
                  className="adm-btn-danger-sm"
                  disabled={deletingId === day.id}
                  onClick={() => deleteDay(day.id, day.destination)}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editing && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>
                <i className={`ti ${isNew ? "ti-plus" : "ti-pencil"}`} />
                {isNew ? "Add New Day" : `Edit — ${editing.destination}`}
              </h2>
              <button className="adm-modal-close" onClick={closeModal}>
                <i className="ti ti-x" />
              </button>
            </div>

            <div className="adm-modal-form">
              <label>
                <span>Day Label</span>
                <input
                  placeholder="e.g. Day 1–2"
                  value={editing.day_label}
                  onChange={(e) => setEditing({ ...editing, day_label: e.target.value })}
                />
              </label>

              <label>
                <span>Destination</span>
                <input
                  placeholder="e.g. Amsterdam"
                  value={editing.destination}
                  onChange={(e) => setEditing({ ...editing, destination: e.target.value })}
                />
              </label>

              <label>
                <span>Activities (one per line, or comma-separated)</span>
                <textarea
                  className="edit-textarea"
                  rows={5}
                  placeholder={"Canal Tour\nVan Gogh Museum\nJordaan District Walk"}
                  value={editing.activities}
                  onChange={(e) => setEditing({ ...editing, activities: e.target.value })}
                />
              </label>

              <label>
                <span>Colour Theme</span>
                <select
                  value={editing.color_class}
                  onChange={(e) => setEditing({ ...editing, color_class: e.target.value })}
                >
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Sort Order (lower = shown first)</span>
                <input
                  type="number"
                  min={1}
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                />
              </label>

              <label className="adm-checkbox-label">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                <span>Visible on public site</span>
              </label>
            </div>

            <div className="adm-modal-footer">
              <button className="adm-btn-primary" onClick={save} disabled={saving}>
                <i className="ti ti-device-floppy" />
                {saving ? "Saving…" : isNew ? "Create Day" : "Save Changes"}
              </button>
              <button className="adm-btn-ghost" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
