import { useEffect, useState } from "react";
import api from "../api/client";

const STATUS_COLORS = {
  fetched: "adm-badge-blue",
  generated: "adm-badge-green",
  duplicate: "adm-badge-gray",
};

export default function AdminFeeds() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/feeds/");
      setFeeds(res.data || []);
    } catch {
      alert("Failed to load feeds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fetchRSS = async () => {
    try {
      setFetching(true);
      const res = await api.post("/feeds/fetch");
      alert(res.data.message || "Fetch complete.");
      await load();
    } catch {
      alert("RSS fetch failed.");
    } finally {
      setFetching(false);
    }
  };

  const deleteFeed = async (id) => {
    if (!window.confirm("Delete this feed entry? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      await api.delete(`/feeds/${id}`);
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleImportant = async (id) => {
    try {
      setTogglingId(id);
      const res = await api.patch(`/feeds/${id}/important`);
      setFeeds((prev) =>
        prev.map((f) => (f.id === id ? { ...f, important: res.data.important } : f))
      );
    } catch {
      alert("Toggle failed.");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = feeds.filter((f) =>
    !search ||
    f.title?.toLowerCase().includes(search.toLowerCase()) ||
    f.city?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero */}
      <div className="dash-hero">
        <img
          className="dash-hero-img"
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80"
          alt="Travel news"
        />
        <div className="dash-hero-overlay">
          <p className="dash-hero-eyebrow">Travel Agent · Admin</p>
          <div className="dash-hero-tags">
            <span className="dash-hero-tag"><i className="ti ti-rss" /> RSS Feeds</span>
            <span className="dash-hero-tag"><i className="ti ti-news" /> Article Management</span>
          </div>
          <h1 className="dash-hero-title">RSS Feed Management</h1>
          <p className="dash-hero-sub">
            View, mark important, delete stale entries and trigger new fetches.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-page-toolbar">
        <input
          className="adm-search-input"
          placeholder="Search by title, city or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="adm-btn-primary" onClick={fetchRSS} disabled={fetching}>
          <i className="ti ti-refresh" /> {fetching ? "Fetching…" : "Fetch RSS Now"}
        </button>
      </div>

      {/* Stats strip */}
      <div className="adm-feed-stats">
        <span><b>{feeds.length}</b> total feeds</span>
        <span><b>{feeds.filter((f) => f.important).length}</b> marked important</span>
        <span><b>{feeds.filter((f) => f.status === "generated").length}</b> generated</span>
        <span><b>{feeds.filter((f) => f.status === "fetched").length}</b> fetched (pending)</span>
      </div>

      {loading ? (
        <div className="dash-loading"><i className="ti ti-loader-2" /> Loading feeds…</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>⭐</th>
                <th>Title</th>
                <th>Source</th>
                <th>City</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className={f.important ? "adm-row-important" : ""}>
                  <td>
                    <button
                      className={`adm-star-btn ${f.important ? "starred" : ""}`}
                      disabled={togglingId === f.id}
                      onClick={() => toggleImportant(f.id)}
                      title={f.important ? "Unmark important" : "Mark as important"}
                    >
                      <i className={`ti ${f.important ? "ti-star-filled" : "ti-star"}`} />
                    </button>
                  </td>
                  <td className="adm-td-title" title={f.title}>
                    {f.title?.length > 60 ? f.title.slice(0, 60) + "…" : f.title}
                  </td>
                  <td className="adm-td-muted">{f.source}</td>
                  <td>{f.city || "—"}</td>
                  <td>{f.category || "—"}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_COLORS[f.status] || "adm-badge-gray"}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="adm-td-muted">{f.published_date || "—"}</td>
                  <td>
                    <button
                      className="adm-btn-danger-sm"
                      disabled={deletingId === f.id}
                      onClick={() => deleteFeed(f.id)}
                      title="Delete feed"
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="adm-empty">
              {search ? "No feeds match your search." : "No feeds found. Click 'Fetch RSS Now' to import articles."}
            </div>
          )}
        </div>
      )}
    </>
  );
}
